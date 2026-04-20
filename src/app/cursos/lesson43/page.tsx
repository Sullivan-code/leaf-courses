"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type SectionKey = 'verbs' | 'vocabulary' | 'usefulPhrases' | 'grammar' | 'realLife' | 'checkItOut';

export default function Lesson43EatingOut() {
  const router = useRouter();
  const [openDrills, setOpenDrills] = useState({
    verbs: false,
    vocabulary: false,
    usefulPhrases: false,
    grammar: false,
    realLife: false,
    checkItOut: false,
  });
  const [showCheckItOutExplanation, setShowCheckItOutExplanation] = useState(false);

  const toggleDrill = (section: SectionKey) => {
    setOpenDrills({
      ...openDrills,
      [section]: !openDrills[section]
    });
  };

  const playAudio = (text: string) => {
    const formattedText = text
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\s-]/g, '')
      .replace(/'/g, '')
      .trim();
    
    console.log('Trying to play audio:', `/audios/${formattedText}.mp3`);
    
    const audio = new Audio(`/audios/${formattedText}.mp3`);
    audio.play().catch(e => console.error("Error playing audio:", e));
  };

  // Image URLs
  const mainImage = "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
  const restaurantImage = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
  const foodImage = "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";

  // Lesson 43 - Verbs (to make, to give)
  const verbs = [
    { english: "to make", portuguese: "fazer" },
    { english: "to give", portuguese: "dar" },
  ];

  // Lesson 43 - New Words
  const newWords = [
    { english: "dish", portuguese: "prato" },
    { english: "hamburger", portuguese: "hambúrguer" },
    { english: "pizza", portuguese: "pizza" },
    { english: "popcorn", portuguese: "pipoca" },
    { english: "cake", portuguese: "bolo" },
    { english: "ice cream", portuguese: "sorvete" },
    { english: "fast food", portuguese: "comida rápida" },
    { english: "tip", portuguese: "gorjeta" },
    { english: "waiter", portuguese: "garçom" },
    { english: "waitress", portuguese: "garçonete" },
    { english: "favorite", portuguese: "favorito(a)" },
    { english: "hot", portuguese: "quente" },
    { english: "cold", portuguese: "frio" },
    { english: "our", portuguese: "nosso" },
    { english: "their", portuguese: "deles" },
    { english: "any", portuguese: "algum / nenhum" },
  ];

  const usefulPhrases = [
    { english: "This is the best restaurant in the city.", portuguese: "Este é o melhor restaurante da cidade." },
    { english: "I want a slice of pie for dessert.", portuguese: "Eu quero uma fatia de torta de sobremesa." },
    { english: "What do you want for dessert?", portuguese: "O que você quer comer de sobremesa?" },
    { english: "I want fruit for dessert / ice cream / a piece of cake.", portuguese: "Eu quero fruta de sobremesa / sorvete / um pedaço de bolo." },
    { english: "Does she know how to make cakes? / pancakes / desserts", portuguese: "Ela sabe fazer bolos? / panquecas / sobremesas" },
    { english: "This is the best restaurant in the city / best mall", portuguese: "Este é o melhor restaurante da cidade / melhor shopping" },
    { english: "This is the best dish in the restaurant / pizza / pie", portuguese: "Este é o melhor prato do restaurante / pizza / torta" },
    { english: "This is my best friend.", portuguese: "Este é o meu melhor amigo" },
  ];

  const grammarExamples = [
    { english: "I have some friends in Germany.", portuguese: "Eu tenho alguns amigos na Alemanha." },
    { english: "Some people don't like to eat fast food.", portuguese: "Algumas pessoas não gostam de comida rápida." },
    { english: "I don't have any money here.", portuguese: "Eu não tenho dinheiro aqui." },
    { english: "He still doesn't have any children.", portuguese: "Ele ainda não tem filhos." },
    { english: "Do you have any tips?", portuguese: "Você tem alguma dica?" },
    { english: "Do you know any good TV series?", portuguese: "Você conhece alguma série boa?" },
    { english: "Do you want some popcorn?", portuguese: "Você quer um pouco de pipoca?" },
  ];

  // Real Life Sentences
  const realLifeSentences = [
    { english: "Do you know how to make chocolate popcorn?", portuguese: "Você sabe fazer pipoca de chocolate?" },
    { english: "I want to make your favorite dish tonight.", portuguese: "Eu quero fazer seu prato favorito hoje à noite." },
    { english: "We want to give you this book.", portuguese: "Nós queremos te dar este livro." },
    { english: "I want to give a gift to my mother.", portuguese: "Eu quero dar um presente para minha mãe." },
    { english: "Do you usually give tips to the waiters?", portuguese: "Você costuma dar gorjeta para os garçons?" },
    { english: "This is the best restaurant in the city.", portuguese: "Este é o melhor restaurante da cidade." },
    { english: "I love that place! Their food is very good!", portuguese: "Eu amo aquele lugar! A comida deles é muito boa!" },
    { english: "We clean our house every Friday.", portuguese: "Nós limpamos nossa casa toda sexta-feira." },
    { english: "I want some tomato sauce, please.", portuguese: "Eu quero um pouco de molho de tomate, por favor." },
    { english: "Do you want some coffee?", portuguese: "Você quer um pouco de café?" },
    { english: "We don't have any food. Let's go to the grocery store.", portuguese: "Nós não temos nenhuma comida. Vamos ao supermercado." },
    { english: "Do you have any salad?", portuguese: "Você tem alguma salada?" },
  ];

  // Check it out practice items
  const checkItOutItems = [
    { item: "a cake", verb: "to make" },
    { item: "popcorn", verb: "to make" },
    { item: "a dessert", verb: "to make" },
    { item: "some coffee", verb: "to make" },
    { item: "cookies", verb: "to make" },
    { item: "soup", verb: "to make" },
    { item: "friends", verb: "to make" },
  ];

  return (
    <div
      className="min-h-screen rounded-2xl py-16 px-6 bg-fixed"
      style={{
        backgroundImage: `url("https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="max-w-6xl mx-auto bg-[#f0f8ff] bg-opacity-95 rounded-[40px] p-10 shadow-lg">
        
        {/* Centered title with image below */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-[#0c4a6e] mb-6">
            🍽️ Lesson 43 - Eating Out
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            Learn to talk about food, restaurants, and use the verbs "to make" and "to give" with some/any.
          </p>
          <div className="w-64 h-64 mx-auto">
            <img
              src={mainImage}
              alt="Eating out at a restaurant"
              className="w-full h-full object-cover rounded-2xl shadow-md"
            />
          </div>
        </div>

        {/* Section 1 - VERBS (to make, to give) with Drill */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-blue-500 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">🔹 1. VERBS (to make / fazer, to give / dar)</h2>
              <p className="mt-2 text-blue-100 italic">
                Clique nos verbos para ouvir a pronúncia e praticar
              </p>
            </div>
            <button 
              onClick={() => toggleDrill('verbs')}
              className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-full transition-colors"
            >
              {openDrills.verbs ? 'Esconder Prática' : 'Mostrar Prática'}
            </button>
          </div>
          
          <div className="p-8">
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6 grid grid-cols-1 md:grid-cols-2 gap-2">
              {verbs.map((verb, index) => (
                <li key={index}>
                  <button 
                    onClick={() => playAudio(verb.english)} 
                    className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                  >
                    {verb.english}
                  </button> = {verb.portuguese}
                </li>
              ))}
            </ul>
            
            {openDrills.verbs && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">
                    1. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('I make')}>I make</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('You make')}>You make</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('He makes')}>He makes</span>
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Eu faço / Você faz / Ele faz</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">
                    2. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('They do not make')}>They do not make</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('We make')}>We make</span>
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Eles não fazem / Nós fazemos</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">
                    3. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Do you make')}>Do you make?</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Does he make')}>Does he make?</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Do they make')}>Do they make?</span>
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Você faz? / Ele faz? / Eles fazem?</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">
                    4. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('I want to make some coffee')}>I want to make some coffee</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('pancakes')}>pancakes</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('cookies')}>cookies</span>
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Eu quero fazer um pouco de café / panquecas / biscoitos</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">
                    5. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('What do you want to make for dinner')}>What do you want to make for dinner?</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('lunch')}>lunch</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('breakfast')}>breakfast</span>
                  </p>
                  <p className="text-sm text-gray-600 mt-1">O que você quer fazer para o jantar? / almoço / café da manhã</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">
                    6. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('I give')}>I give</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('We give')}>We give</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('They give')}>They give</span>
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Eu dou / Nós damos / Eles dão</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">
                    7. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('I want to give my opinion')}>I want to give my opinion</span>
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Eu quero dar minha opinião</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">
                    8. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Do you like to give gifts')}>Do you like to give gifts?</span>
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Você gosta de dar presentes?</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">
                    9. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('I give gifts to my children')}>I give gifts to my children</span>
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Eu dou presentes para meus filhos</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">
                    10. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('I want to give you a book')}>I want to give you a book</span>
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Eu quero te dar um livro</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Section 2 - NEW WORDS with Drill */}
        <div className="bg-white border-2 border-green-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-green-500 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">🔹 2. NEW WORDS (Vocabulário)</h2>
              <p className="mt-2 text-green-100 italic">
                Clique em cada palavra para ouvir sua pronúncia correta
              </p>
            </div>
            <button 
              onClick={() => toggleDrill('vocabulary')}
              className="text-sm bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded-full transition-colors"
            >
              {openDrills.vocabulary ? 'Esconder Prática' : 'Mostrar Prática'}
            </button>
          </div>
          
          <div className="p-8">
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {newWords.map((word, index) => (
                <li key={index}>
                  <button 
                    onClick={() => playAudio(word.english)} 
                    className="text-green-600 font-bold cursor-pointer hover:text-green-800 transition-colors"
                  >
                    {word.english}
                  </button> = {word.portuguese}
                </li>
              ))}
            </ul>
            
            {openDrills.vocabulary && (
              <div className="mt-4 bg-green-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="p-4 bg-white rounded-xl border border-green-200">
                  <p className="text-lg font-medium text-gray-800">
                    🍕 <span className="text-green-600 font-bold cursor-pointer hover:text-green-800" onClick={() => playAudio('pizza')}>pizza</span> / <span className="text-green-600 font-bold cursor-pointer hover:text-green-800" onClick={() => playAudio('hamburger')}>hamburger</span> / <span className="text-green-600 font-bold cursor-pointer hover:text-green-800" onClick={() => playAudio('fast food')}>fast food</span>
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-green-200">
                  <p className="text-lg font-medium text-gray-800">
                    🍰 <span className="text-green-600 font-bold cursor-pointer hover:text-green-800" onClick={() => playAudio('cake')}>cake</span> / <span className="text-green-600 font-bold cursor-pointer hover:text-green-800" onClick={() => playAudio('ice cream')}>ice cream</span> / <span className="text-green-600 font-bold cursor-pointer hover:text-green-800" onClick={() => playAudio('popcorn')}>popcorn</span>
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-green-200">
                  <p className="text-lg font-medium text-gray-800">
                    👨‍🍳 <span className="text-green-600 font-bold cursor-pointer hover:text-green-800" onClick={() => playAudio('waiter')}>waiter</span> / <span className="text-green-600 font-bold cursor-pointer hover:text-green-800" onClick={() => playAudio('waitress')}>waitress</span> / <span className="text-green-600 font-bold cursor-pointer hover:text-green-800" onClick={() => playAudio('tip')}>tip</span>
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-green-200">
                  <p className="text-lg font-medium text-gray-800">
                    🔥 <span className="text-green-600 font-bold cursor-pointer hover:text-green-800" onClick={() => playAudio('hot')}>hot</span> / <span className="text-green-600 font-bold cursor-pointer hover:text-green-800" onClick={() => playAudio('cold')}>cold</span> / <span className="text-green-600 font-bold cursor-pointer hover:text-green-800" onClick={() => playAudio('favorite')}>favorite</span>
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-green-200">
                  <p className="text-lg font-medium text-gray-800">
                    👥 <span className="text-green-600 font-bold cursor-pointer hover:text-green-800" onClick={() => playAudio('our')}>our</span> / <span className="text-green-600 font-bold cursor-pointer hover:text-green-800" onClick={() => playAudio('their')}>their</span> / <span className="text-green-600 font-bold cursor-pointer hover:text-green-800" onClick={() => playAudio('any')}>any</span>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Section 3 - GRAMMAR (Some/Any) with Drill */}
        <div className="bg-white border-2 border-purple-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-purple-500 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">🔹 3. GRAMMAR (Some / Any)</h2>
              <p className="mt-2 text-purple-100 italic">
                Some = afirmativo / Any = negativo e interrogativo
              </p>
            </div>
            <button 
              onClick={() => toggleDrill('grammar')}
              className="text-sm bg-purple-600 hover:bg-purple-700 text-white px-4 py-1 rounded-full transition-colors"
            >
              {openDrills.grammar ? 'Esconder Prática' : 'Mostrar Prática'}
            </button>
          </div>
          
          <div className="p-8">
            <div className="bg-purple-50 p-4 rounded-[20px] text-gray-800 space-y-3 mb-6">
              {grammarExamples.map((example, index) => (
                <p key={index}>
                  <button 
                    onClick={() => playAudio(example.english)} 
                    className="text-purple-600 font-bold cursor-pointer hover:text-purple-800 transition-colors"
                  >
                    {example.english}
                  </button> = {example.portuguese}
                </p>
              ))}
            </div>
            
            {openDrills.grammar && (
              <div className="mt-4 bg-purple-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    1. <span className="text-purple-600 font-bold cursor-pointer hover:text-purple-800" onClick={() => playAudio('She has some books at home')}>She has some books at home</span> / <span className="text-purple-600 font-bold cursor-pointer hover:text-purple-800" onClick={() => playAudio('at the office')}>at the office</span> / <span className="text-purple-600 font-bold cursor-pointer hover:text-purple-800" onClick={() => playAudio('at the company')}>at the company</span>
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Ela tem alguns livros em casa / no escritório / na empresa</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    2. <span className="text-purple-600 font-bold cursor-pointer hover:text-purple-800" onClick={() => playAudio('My neighbor has some friends abroad')}>My neighbor has some friends abroad</span> / <span className="text-purple-600 font-bold cursor-pointer hover:text-purple-800" onClick={() => playAudio('cousins')}>cousins</span> / <span className="text-purple-600 font-bold cursor-pointer hover:text-purple-800" onClick={() => playAudio('relatives')}>relatives</span>
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Meu vizinho tem alguns amigos no exterior / primos / parentes</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    3. <span className="text-purple-600 font-bold cursor-pointer hover:text-purple-800" onClick={() => playAudio('Some people do not like to eat hamburgers')}>Some people do not like to eat hamburgers</span> / <span className="text-purple-600 font-bold cursor-pointer hover:text-purple-800" onClick={() => playAudio('pizza')}>pizza</span> / <span className="text-purple-600 font-bold cursor-pointer hover:text-purple-800" onClick={() => playAudio('popcorn')}>popcorn</span>
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Algumas pessoas não gostam de comer hambúrguer / pizza / pipoca</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    4. <span className="text-purple-600 font-bold cursor-pointer hover:text-purple-800" onClick={() => playAudio('I do not want any bread thanks')}>I don't want any bread, thanks</span>
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Eu não quero nenhum pão, obrigado</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    5. <span className="text-purple-600 font-bold cursor-pointer hover:text-purple-800" onClick={() => playAudio('I do not have any butter')}>I don't have any butter</span> / <span className="text-purple-600 font-bold cursor-pointer hover:text-purple-800" onClick={() => playAudio('jam')}>jam</span> / <span className="text-purple-600 font-bold cursor-pointer hover:text-purple-800" onClick={() => playAudio('honey')}>honey</span>
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Eu não tenho nenhuma manteiga / geleia / mel</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    6. <span className="text-purple-600 font-bold cursor-pointer hover:text-purple-800" onClick={() => playAudio('I do not know any schools here')}>I don't know any schools here</span>
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Eu não conheço nenhuma escola aqui</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    7. <span className="text-purple-600 font-bold cursor-pointer hover:text-purple-800" onClick={() => playAudio('He does not know any good TV series')}>He doesn't know any good TV series</span> / <span className="text-purple-600 font-bold cursor-pointer hover:text-purple-800" onClick={() => playAudio('books')}>books</span> / <span className="text-purple-600 font-bold cursor-pointer hover:text-purple-800" onClick={() => playAudio('stories')}>stories</span>
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Ele não conhece nenhuma série boa / livro / história</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    8. <span className="text-purple-600 font-bold cursor-pointer hover:text-purple-800" onClick={() => playAudio('Do you have any tips to give me')}>Do you have any tips to give me?</span>
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Você tem alguma dica para me dar?</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Section 4 - USEFUL PHRASES with Drill */}
        <div className="bg-white border-2 border-yellow-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-yellow-500 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">🔹 4. USEFUL PHRASES</h2>
              <p className="mt-2 text-yellow-100 italic">
                Frases úteis para comer fora e no restaurante
              </p>
            </div>
            <button 
              onClick={() => toggleDrill('usefulPhrases')}
              className="text-sm bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-1 rounded-full transition-colors"
            >
              {openDrills.usefulPhrases ? 'Esconder Prática' : 'Mostrar Prática'}
            </button>
          </div>
          
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {usefulPhrases.map((phrase, index) => (
                <div key={index} className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
                  <button 
                    onClick={() => playAudio(phrase.english)} 
                    className="text-yellow-700 font-bold cursor-pointer hover:text-yellow-900 transition-colors text-left w-full"
                  >
                    {phrase.english}
                  </button>
                  <p className="text-sm text-gray-600 mt-1">{phrase.portuguese}</p>
                </div>
              ))}
            </div>
            
            {openDrills.usefulPhrases && (
              <div className="mt-4 bg-yellow-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="p-4 bg-white rounded-xl border border-yellow-200">
                  <p className="text-lg font-medium text-gray-800">
                    📝 <span className="text-yellow-600 font-bold cursor-pointer hover:text-yellow-800" onClick={() => playAudio('May I see the menu please')}>May I see the menu, please?</span> → Sure, here you are.
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-yellow-200">
                  <p className="text-lg font-medium text-gray-800">
                    🍕 <span className="text-yellow-600 font-bold cursor-pointer hover:text-yellow-800" onClick={() => playAudio('Lets go to a pizza place')}>Let's go to a pizza place!</span>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Section 5 - REAL LIFE Practice */}
        <div className="bg-white border-2 border-red-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-red-500 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">🔹 5. REAL LIFE (Uso no dia a dia)</h2>
              <p className="mt-2 text-red-100 italic">
                Pratique situações reais em restaurantes e sobre comida
              </p>
            </div>
            <button 
              onClick={() => toggleDrill('realLife')}
              className="text-sm bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded-full transition-colors"
            >
              {openDrills.realLife ? 'Esconder Prática' : 'Mostrar Prática'}
            </button>
          </div>
          
          <div className="p-8">
            <div className="bg-red-50 rounded-[20px] p-6">
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:w-2/3 space-y-6">
                  {realLifeSentences.map((sentence, index) => (
                    <div key={index} className="group">
                      <div className="flex items-start">
                        <button 
                          onClick={() => playAudio(sentence.english)} 
                          className="mr-3 mt-1 text-red-600 hover:text-red-800 transition-colors flex-shrink-0"
                          aria-label="Play audio"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828a1 1 0 010-1.415z" clipRule="evenodd" />
                          </svg>
                        </button>
                        <div>
                          <p className="text-lg font-medium">
                            {index + 1}. {sentence.english}
                          </p>
                          <p className="text-sm text-gray-600">{sentence.portuguese}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="lg:w-1/3 flex flex-col gap-4">
                  <div className="bg-white rounded-2xl p-4 shadow-md h-full">
                    <div className="relative h-48 w-full">
                      <img
                        src={restaurantImage}
                        alt="Restaurant"
                        className="rounded-xl object-cover w-full h-full"
                      />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">
                      Eating at a restaurant
                    </p>
                  </div>
                  
                  <div className="bg-white rounded-2xl p-4 shadow-md h-full">
                    <div className="relative h-48 w-full">
                      <img
                        src={foodImage}
                        alt="Delicious food"
                        className="rounded-xl object-cover w-full h-full"
                      />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">
                      Delicious dishes
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 6 - CHECK IT OUT! */}
        <div className="bg-white border-2 border-teal-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-teal-500 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold">✅ CHECK IT OUT! - Practice "to make"</h2>
              <p className="mt-2 text-teal-100 italic">
                Complete as frases com o verbo "to make" (fazer)
              </p>
            </div>
            <button 
              onClick={() => setShowCheckItOutExplanation(!showCheckItOutExplanation)}
              className="text-sm bg-teal-600 hover:bg-teal-700 text-white px-4 py-1 rounded-full transition-colors"
            >
              {showCheckItOutExplanation ? 'Esconder Prática' : 'Mostrar Prática'}
            </button>
          </div>

          <div className="p-8">
            {showCheckItOutExplanation && (
              <div className="mb-6 p-4 bg-teal-50 rounded-xl border border-teal-200 animate-fadeIn">
                <p className="text-teal-800 text-sm">📚 <strong>Practice:</strong> Use the verb "to make" (fazer) with the words below.</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-4">
                  {checkItOutItems.map((item, idx) => (
                    <div key={idx} className="bg-white rounded-lg p-3 text-center border border-teal-200">
                      <button
                        onClick={() => playAudio(`to make ${item.item}`)}
                        className="text-teal-600 font-medium hover:text-teal-800 transition-colors"
                      >
                        {item.item}
                      </button>
                      <p className="text-xs text-gray-500 mt-1">{item.verb}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-white rounded-lg border border-teal-200">
                  <p className="text-gray-700">✨ <strong>Example:</strong> <button onClick={() => playAudio('I want to make a cake')} className="text-teal-600 font-bold cursor-pointer hover:text-teal-800">I want to make a cake</button> → Eu quero fazer um bolo</p>
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-teal-50 rounded-xl p-4 text-center border border-teal-200">
                <button
                  onClick={() => playAudio('May I see the menu please')}
                  className="text-lg font-bold text-teal-600 hover:text-teal-800 transition-colors"
                >
                  🍽️ "May I see the menu, please?"
                </button>
                <p className="text-sm text-gray-600 mt-2">→ Sure, here you are.</p>
              </div>
              <div className="bg-teal-50 rounded-xl p-4 text-center border border-teal-200">
                <button
                  onClick={() => playAudio('Lets go to a pizza place')}
                  className="text-lg font-bold text-teal-600 hover:text-teal-800 transition-colors"
                >
                  🍕 "Let's go to a pizza place!"
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={() => router.push("/cursos/lesson42")}
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-8 rounded-full transition-colors"
          >
            &larr; Previous Lesson (42)
          </button>
          <button
            onClick={() => router.push("/cursos/lesson44")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full transition-colors"
          >
            Next Lesson (44) &rarr;
          </button>
        </div>

        <div className="text-center text-gray-400 text-sm mt-8">
          <p>Lesson 43 - Eating Out | Verbs: to make, to give | Grammar: Some / Any</p>
        </div>
      </div>
    </div>
  );
}