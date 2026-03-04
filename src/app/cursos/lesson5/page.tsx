"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

type SectionKey = 'verbs' | 'vocabulary' | 'usefulPhrases' | 'grammar';

export default function LessonFoodAndDrink() {
  const router = useRouter();
  const [openDrills, setOpenDrills] = useState({
    verbs: false,
    vocabulary: false,
    usefulPhrases: false,
    grammar: false,
  });

  const toggleDrill = (section: SectionKey) => {
    setOpenDrills({
      ...openDrills,
      [section]: !openDrills[section]
    });
  };

  const playAudio = (text: string) => {
    // Formatação mais robusta para frases com múltiplas palavras
    const formattedText = text
      .toLowerCase()
      .replace(/\s+/g, '-') // Usar hífens em vez de underscores
      .replace(/[^\w\s-]/g, '') // Manter hífens
      .replace(/\s*\/\s*/g, '-or-') // Tratar "ou" em opções
      .trim();
    
    console.log('Tentando reproduzir áudio:', `/audios/${formattedText}.mp3`); // Para debug
    
    const audio = new Audio(`/audios/${formattedText}.mp3`);
    audio.play().catch(e => console.error("Erro ao reproduzir áudio:", e));
  };

  // URLs das imagens
  const mainImage = "https://i.ibb.co/tTpRLxNr/l5-main.jpg";
  const beefAndFishImage = "https://i.ibb.co/N6P2sn5P/beef-and-fish.jpg";
  const drinkAndSandwichImage = "https://i.ibb.co/5xwfgP0Y/drink-and-sandwich.jpg";
  const vegetablesImage = "https://i.ibb.co/whTg289T/vegetables.jpg";

  return (
    <div
      className="min-h-screen rounded-2xl py-16 px-6 bg-fixed"
      style={{
        backgroundImage: `url("/images/l5-orange-juice.jpg")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="max-w-5xl mx-auto bg-[#f0f8ff] bg-opacity-95 rounded-[40px] p-10 shadow-lg">
        
        {/* Título centralizado com imagem abaixo */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-[#0c4a6e] mb-6">
            Lesson 5 - Food & Drink
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            Aprenda a expressar preferências sobre alimentos e bebidas em inglês. 🍖🥗
          </p>
          <div className="w-64 h-64 mx-auto">
            <img
              src={mainImage}
              alt="Food and drink"
              className="w-full h-full object-cover rounded-2xl shadow-md"
            />
          </div>
        </div>

        {/* Seção 1 - Verbos com Drill (ORGANIZED SECTION) */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-blue-500 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Verbs</h2>
              <p className="mt-2 text-blue-100 italic">
                Clique nos verbos para ouvir a pronúncia e pratique suas formas
              </p>
            </div>
            <button 
              onClick={() => toggleDrill('verbs')}
              className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-full transition-colors"
            >
              {openDrills.verbs ? 'Ocultar Prática' : 'Mostrar Prática'}
            </button>
          </div>
          
          <div className="p-8">
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
              <li>
                <button 
                  onClick={() => playAudio('to prefer')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  to prefer
                </button> = preferir
              </li>
              <li>
                <button 
                  onClick={() => playAudio('to love')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  to love
                </button> = amar, adorar
              </li>
            </ul>
            
            {openDrills.verbs && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">1. I prefer <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('prefer')}>juice</span>. / soda</p>
                  <p className="text-sm text-gray-600 mt-1">Eu prefiro suco. / refrigerante</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">2. Do you prefer <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('do you prefer')}>rice or beans</span>? / meat or fish / chicken or salad</p>
                  <p className="text-sm text-gray-600 mt-1">Você prefere arroz ou feijão? / carne ou peixe / frango ou salada</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">3. They prefer <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('they prefer')}>bread with butter</span>. / eggs / French fries</p>
                  <p className="text-sm text-gray-600 mt-1">Eles preferem pão com manteiga. / ovos / batata frita</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">4. We prefer <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('we prefer')}>salad</span>. / vegetables / greens</p>
                  <p className="text-sm text-gray-600 mt-1">Nós preferimos salada. / legumes / verduras</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">5. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('she prefers')}>She prefers</span> fish. / chicken / meat</p>
                  <p className="text-sm text-gray-600 mt-1">Ela prefere peixe. / frango / carne</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">6. I <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('love')}>love</span> pizza. / hamburger / chocolate</p>
                  <p className="text-sm text-gray-600 mt-1">Eu adoro pizza. / hambúrguer / chocolate</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">7. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('do you love')}>Do you love</span> ice cream? / cake / sweets</p>
                  <p className="text-sm text-gray-600 mt-1">Você adora sorvete? / bolo / doces</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">8. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('they love')}>They love</span> French fries. / sandwiches / soda</p>
                  <p className="text-sm text-gray-600 mt-1">Eles adoram batatas fritas. / sanduíches / refrigerante</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">9. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('we love')}>We love</span> Italian food. / Japanese / Mexican</p>
                  <p className="text-sm text-gray-600 mt-1">Nós adoramos comida italiana. / japonesa / mexicana</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">10. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('she loves')}>She loves</span> coffee. / tea / natural juices</p>
                  <p className="text-sm text-gray-600 mt-1">Ela adora café. / chá / sucos naturais</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">11. I <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('prefer to eat')}>prefer to eat</span> fruits. / vegetables / healthy food</p>
                  <p className="text-sm text-gray-600 mt-1">Eu prefiro comer frutas. / vegetais / alimentos saudáveis</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">12. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('do you prefer to drink')}>Do you prefer to drink</span> water or juice? / tea or coffee</p>
                  <p className="text-sm text-gray-600 mt-1">Você prefere beber água ou suco? / chá ou café</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Seção 2 - Vocabulário com Drill */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-blue-500 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">New Vocabulary</h2>
              <p className="mt-2 text-blue-100 italic">
                Clique em cada palavra para ouvir sua pronúncia correta
              </p>
            </div>
            <button 
              onClick={() => toggleDrill('vocabulary')}
              className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-full transition-colors"
            >
              {openDrills.vocabulary ? 'Ocultar Prática' : 'Mostrar Prática'}
            </button>
          </div>
          
          <div className="p-8">
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <li>
                <button 
                  onClick={() => playAudio('beef')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  beef
                </button> = carne bovina
              </li>
              <li>
                <button 
                  onClick={() => playAudio('chicken')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  chicken
                </button> = frango
              </li>
              <li>
                <button 
                  onClick={() => playAudio('fish')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  fish
                </button> = peixe
              </li>
              <li>
                <button 
                  onClick={() => playAudio('bacon')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  bacon
                </button> = bacon
              </li>
              <li>
                <button 
                  onClick={() => playAudio('sausage')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  sausage
                </button> = linguiça, salsicha
              </li>
              <li>
                <button 
                  onClick={() => playAudio('tomato')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  tomato
                </button> = tomate
              </li>
              <li>
                <button 
                  onClick={() => playAudio('salad')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  salad
                </button> = salada
              </li>
              <li>
                <button 
                  onClick={() => playAudio('french fries')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  French fries
                </button> = batatas fritas
              </li>
              <li>
                <button 
                  onClick={() => playAudio('sandwich')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  sandwich
                </button> = sanduíche
              </li>
              <li>
                <button 
                  onClick={() => playAudio('vegetables')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  vegetables
                </button> = legumes, verduras
              </li>
              <li>
                <button 
                  onClick={() => playAudio('rice')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  rice
                </button> = arroz
              </li>
              <li>
                <button 
                  onClick={() => playAudio('beans')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  beans
                </button> = Feijão
              </li>
              <li>
                <button 
                  onClick={() => playAudio('soda')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  soda
                </button> = Refrigerante
              </li>
              <li>
                <button 
                  onClick={() => playAudio('or')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  or
                </button> = ou
              </li>
              <li>
                <button 
                  onClick={() => playAudio('what')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  what
                </button> = o que, qual, quer
              </li>
            </ul>
            
            {openDrills.vocabulary && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">1. Eu <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('prefer')}>prefiro</span> carne bovina. / frango / peixe</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">2. Você quer <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('bacon')}>bacon</span> com ovos? / salsicha / tomate</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">3. Nós <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('love')}>adoramos</span> salada. / legumes / batatas fritas</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">4. Eu quero um <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('sandwich')}>sanduíche</span>. / salada / prato com peixe</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">5. Você <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('prefer')}>prefere</span> tomate na salada? / bacon / salsicha</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">6. A comida está na <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('refrigerator')}>geladeira</span>. / freezer / armário</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">7. Você quer carne <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('or')}>ou</span> frango? / peixe / salada</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">8. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('what')}>O que</span> você quer comer? / beber / preferir</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">9. Eu <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('love')}>adoro</span> sanduíches. / batatas fritas / pizza</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">10. Eles <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('prefer')}>preferem</span> vegetais cozidos. / crus / grelhados</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Seção 3 - Frases Úteis com Drill */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-blue-500 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Useful Phrases</h2>
              <p className="mt-2 text-blue-100 italic">
                Pratique frases comuns para expressar preferências alimentares
              </p>
            </div>
            <button 
              onClick={() => toggleDrill('usefulPhrases')}
              className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-full transition-colors"
            >
              {openDrills.usefulPhrases ? 'Ocultar Prática' : 'Mostrar Prática'}
            </button>
          </div>
          
          <div className="p-8">
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
              <li>
                <button 
                  onClick={() => playAudio('i want a glass of water please')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  I want a glass of water, please.
                </button> = Eu quero um copo de água, por favor.
              </li>
              <li>
                <button 
                  onClick={() => playAudio('i prefer a cup of tea')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  I prefer a cup of tea.
                </button> = Eu prefiro uma xícara de chá.
              </li>
              <li>
                <button 
                  onClick={() => playAudio('we love rice and beans for lunch')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  We love rice and beans for lunch.
                </button> = Nós adoramos arroz e feijão no almoço.
              </li>
              <li>
                <button 
                  onClick={() => playAudio('i eat bread and eggs for breakfast')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  I eat bread and eggs for breakfast.
                </button> = Eu como pão e ovos no café da manhã.
              </li>
              <li>
                <button 
                  onClick={() => playAudio('i-prefer-fish-for-dinner')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  I prefer fish for dinner.
                </button> = Eu prefiro peixe no jantar.
              </li>
              <li>
                <button 
                  onClick={() => playAudio('what-do-you-prefer-to-eat')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  What do you prefer to eat?
                </button> = O que você prefere comer?
              </li>
              <li>
                <button 
                  onClick={() => playAudio('what-do-you-want-to-drink')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  What do you want to drink?
                </button> = O que você quer beber?
              </li>
              <li>
                <button 
                  onClick={() => playAudio('i-love-pizza-for-dinner')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  I love pizza for dinner.
                </button> = Eu adoro pizza no jantar.
              </li>
            </ul>
            
            {openDrills.usefulPhrases && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">1. Eu quero um copo de <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('water')}>água</span>, por favor. / suco / leite</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">2. Eu quero uma xícara de <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('tea')}>chá</span>. / café / chocolate</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">3. Eu como <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('rice and beans')}>arroz e feijão</span> no almoço. / carne e salada / peixe e legumes</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">4. Eu como <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('bread and eggs')}>pão e ovos</span> no café da manhã. / cereal e leite / frutas e iogurte</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">5. Eu <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('prefer')}>prefiro</span> peixe no jantar. / frango / salada</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">6. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('what')}>O que</span> você quer comer? / beber / jantar</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">7. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('what')}>O que</span> você quer para o almoço? / jantar / café da manhã</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">8. Eu <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('love')}>adoro</span> pizza no jantar. / massa / comida japonesa</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">9. Você <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('prefer')}>prefere</span> carne ou frango no jantar? / peixe / salada</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">10. Nós <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('love')}>amamos</span> sobremesa depois do jantar. / café / chá</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Seção 4 - Gramática com Drill */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-blue-500 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Grammar</h2>
              <p className="mt-2 text-blue-100 italic">
                Estruturas para fazer perguntas sobre preferências alimentares
              </p>
            </div>
            <button 
              onClick={() => toggleDrill('grammar')}
              className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-full transition-colors"
            >
              {openDrills.grammar ? 'Ocultar Prática' : 'Mostrar Prática'}
            </button>
          </div>
          
          <div className="p-8">
            <div className="bg-blue-50 p-4 rounded-[20px] text-gray-800 space-y-3 mb-6">
              <p>
                <button 
                  onClick={() => playAudio('do-you-eat-fish')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  Do you eat fish?
                </button> = Você come peixe?
              </p>
              <p>
                <button 
                  onClick={() => playAudio('do-you-want-to-eat-french-fries')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  Do you want to eat French fries?
                </button> = Você quer comer batatas fritas?
              </p>
              <p>
                <button 
                  onClick={() => playAudio('do-you-eat-bread-for-breakfast')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  Do you eat bread for breakfast?
                </button> = Você come pão no café da manhã?
              </p>
              <p>
                <button 
                  onClick={() => playAudio('what do you eat for dinner')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  What do you eat for dinner?
                </button> = O que você come no jantar?
              </p>
              <p>
                <button 
                  onClick={() => playAudio('what do you want to drink')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  What do you want to drink?
                </button> = O que você quer beber?
              </p>
              <p>
                <button 
                  onClick={() => playAudio('what-do-you-like-to-eat')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  What do you like to eat?
                </button> = O que você gosta de comer?
              </p>
              <p>
                <button 
                  onClick={() => playAudio('do-you-prefer-coffee-or-tea')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  Do you prefer coffee or tea?
                </button> = Você prefere café ou chá?
              </p>
              <p>
                <button 
                  onClick={() => playAudio('do you love chocolate')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  Do you love chocolate?
                </button> = Você adora chocolate?
              </p>
            </div>
            
            {openDrills.grammar && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">1. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('do you eat')}>Do you eat</span> bread? / rice / eggs / salad / fish</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">2. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('do you drink')}>Do you drink</span> juice? / soda / tea / coffee / milk</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">3. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('do you want')}>Do you want</span> water? / soda / rice / beans / sausage</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">4. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('do you like')}>Do you like</span> salad? / fish / chicken / French fries / meat</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">5. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('do you eat')}>Do you eat</span> chicken? / fish / meat / vegetables / sausage</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">6. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('do you drink')}>Do you drink</span> soda? / juice / milk / water / tea</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">7. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('do you like')}>Do you like</span> sandwiches? / tomatoes / salad / bacon / beans</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">8. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('do you want')}>Do you want</span> soda? / juice / water / meat / eggs</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">9. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('do you prefer')}>Do you prefer</span> rice? / beans / French fries / salad / bacon</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">10. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('do you prefer to eat')}>Do you prefer to eat</span> meat? / fish / chicken / sausage</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">11. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('do you love')}>Do you love</span> pizza? / chocolate / ice cream</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">12. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('do you prefer')}>Do you prefer</span> coffee or tea? / juice or soda / water or milk</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">13. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('what do you prefer to eat')}>What do you prefer to eat</span> for dinner? / lunch / breakfast</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">14. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('what do you love to drink')}>What do you love to drink</span> in the morning? / afternoon / evening</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Seção 5 - Real Life Practice*/}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-blue-500 text-white py-4 px-8">
            <h2 className="text-2xl font-bold">Real Life Practice</h2>
            <p className="mt-2 text-blue-100 italic">
              Substitua as palavras em azul para praticar a pronúncia em situações reais
            </p>
          </div>
          
          <div className="p-8">
            <div className="bg-blue-50 rounded-[20px] p-6">
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Frases - 2/3 da largura em grandes */}
                <div className="lg:w-2/3 space-y-6">
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio('i prefer to drink a glass of water')} 
                        className="mr-3 mt-1 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828a1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          1. I <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                            onClick={() => playAudio('prefer')}
                          >prefer</span> to drink a glass of water.
                        </p>
                        <p className="text-sm text-gray-600">Eu prefiro beber um copo de água.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio('i prefer to eat beef and vegetables')} 
                        className="mr-3 mt-1 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828a1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          2. I <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                            onClick={() => playAudio('prefer')}
                          >prefer</span> to eat beef and vegetables.
                        </p>
                        <p className="text-sm text-gray-600">Eu prefiro comer carne bovina e legumes.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio('i prefer juice to soda')} 
                        className="mr-3 mt-1 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828a1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          3. I <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                            onClick={() => playAudio('prefer')}
                          >prefer</span> juice to soda.
                        </p>
                        <p className="text-sm text-gray-600">Eu prefiro suco a refrigerante.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio('i love french fries')} 
                        className="mr-3 mt-1 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828a1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          4. I <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                            onClick={() => playAudio('love')}
                          >love</span> French fries.
                        </p>
                        <p className="text-sm text-gray-600">Eu adoro batatas fritas.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio('i prefer to eat chicken and salad for lunch')} 
                        className="mr-3 mt-1 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828a1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          5. I <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                            onClick={() => playAudio('prefer')}
                          >prefer</span> to eat chicken and salad for lunch.
                        </p>
                        <p className="text-sm text-gray-600">Eu prefiro comer frango e salada no almoço.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio('do-you-like-sausages-and-bacon')} 
                        className="mr-3 mt-1 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828a1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          6. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                            onClick={() => playAudio('do you like')}
                          >Do you like</span> sausages and bacon?
                        </p>
                        <p className="text-sm text-gray-600">Você gosta de salsichas e bacon?</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio('do-you-want-to-drink-juice')} 
                        className="mr-3 mt-1 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828a1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          7. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                            onClick={() => playAudio('do you want to drink')}
                          >Do you want to drink</span> juice?
                        </p>
                        <p className="text-sm text-gray-600">Você quer beber suco?</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio('do-you-prefer-to-eat-beef-or-fish-for-dinner')} 
                        className="mr-3 mt-1 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828a1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          8. Do you prefer to eat <span 
                            className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                            onClick={() => playAudio('fish or beef')}
                          >fish or beef</span> for dinner?
                        </p>
                        <p className="text-sm text-gray-600">Você prefere comer peixe ou carne bovina no jantar?</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio('what-do-you-like')} 
                        className="mr-3 mt-1 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828a1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          9. <span 
                            className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                            onClick={() => playAudio('what do you like')}
                          >What do you like</span>?
                        </p>
                        <p className="text-sm text-gray-600">O que você gosta?</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio('what do you want to eat')} 
                        className="mr-3 mt-1 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828a1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          10. <span 
                            className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                            onClick={() => playAudio('what do you want to eat')}
                          >What do you want to eat</span>?
                        </p>
                        <p className="text-sm text-gray-600">O que você quer comer?</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Container das imagens - 1/3 da largura em grandes */}
                <div className="lg:w-1/3 flex flex-col gap-4">
                  <div className="bg-white rounded-2xl p-4 shadow-md h-full">
                    <div className="relative h-64 w-full">
                      <img
                        src={beefAndFishImage}
                        alt="Refeições principais"
                        className="rounded-xl object-cover w-full h-full"
                      />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">
                      Carnes, peixes e acompanhamentos
                    </p>
                  </div>
                  
                  <div className="bg-white rounded-2xl p-4 shadow-md h-full">
                    <div className="relative h-64 w-full">
                      <img
                        src={drinkAndSandwichImage}
                        alt="Bebidas e sanduíches"
                        className="rounded-xl object-cover w-full h-full"
                      />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">
                      Bebidas e sanduíches variados
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Seção 6 - Check It Out (estilo print) */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-blue-500 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold">CHECK IT OUT!</h2>
              <p className="mt-2 text-blue-100 italic">
                Pratique estruturas essenciais para falar sobre preferências alimentares
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row">
            {/* Coluna esquerda - Perguntas e respostas */}
            <div className="bg-blue-900 text-white flex-1 p-6 space-y-4 text-xl">
              <div className="mb-4">
                <h3 className="font-bold text-lg mb-2 text-yellow-300">Respostas Simples:</h3>
                <p className="text-sm text-blue-200 mb-2">
                  Use <span className="font-bold">"Yes, I do"</span> para respostas positivas e 
                  <span className="font-bold"> "No, I don't"</span> para respostas negativas quando a pergunta começa com "Do you...".
                </p>
              </div>
              <div className="flex items-center group">
                <button 
                  onClick={() => playAudio("yes-i-do-no-i-dont")}
                  className="mr-2 text-blue-200 hover:text-white transition-colors"
                  aria-label="Play audio"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                </button>
                <p>• Do you eat beef? → <span className="font-bold">Yes, I do. / No, I don't.</span></p>
              </div>
              <div className="flex items-center group">
                <button 
                  onClick={() => playAudio("yes-i-do-no-i-dont")}
                  className="mr-2 text-blue-200 hover:text-white transition-colors"
                  aria-label="Play audio"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                </button>
                <p>• Do you drink soda? → <span className="font-bold">Yes, I do. / No, I don't.</span></p>
              </div>
              <div className="flex items-center group">
                <button 
                  onClick={() => playAudio("yes-i-do-no-i-dont")}
                  className="mr-2 text-blue-200 hover:text-white transition-colors"
                  aria-label="Play audio"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                </button>
                <p>• Do you prefer coffee? → <span className="font-bold">Yes, I do. / No, I don't.</span></p>
              </div>
              <div className="flex items-center group">
                <button 
                  onClick={() => playAudio("yes-i-do-no-i-dont")}
                  className="mr-2 text-blue-200 hover:text-white transition-colors"
                  aria-label="Play audio"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                </button>
                <p>• Do you love chocolate? → <span className="font-bold">Yes, I do. / No, I don't.</span></p>
              </div>
            </div>

            {/* Coluna central - Imagem e balão */}
            <div className="bg-white flex-1 p-6 flex flex-col items-center justify-center text-xl relative">
              <img
                src={vegetablesImage}
                alt="Pessoa escolhendo comida"
                className="rounded-full w-40 h-40 object-cover mb-4"
              />
              <div className="bg-yellow-200 text-black px-4 py-2 rounded-xl shadow-md text-center">
                What do you want to eat? <span className="font-bold">I want chicken!</span>
              </div>
              <div className="mt-4 text-center text-sm text-gray-600">
                <p>Use <span className="font-bold">"do"</span> para perguntas e respostas simples</p>
                <p>Exemplo: "Do you like pizza?" → "Yes, I <span className="font-bold">do</span>"</p>
              </div>
            </div>

            {/* Coluna direita - Plural forms */}
            <div className="bg-blue-900 text-white flex-1 p-6 space-y-4 text-xl">
              <h3 className="font-bold text-lg mb-2">Plurals examples:</h3>
              <div className="flex items-center group">
                <button 
                  onClick={() => playAudio("vegetables")}
                  className="mr-2 text-blue-200 hover:text-white transition-colors"
                  aria-label="Play audio"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                </button>
                <p>• vegetable → <span className="font-bold">vegetables</span></p>
              </div>
              <div className="flex items-center group">
                <button 
                  onClick={() => playAudio("tomatoes")}
                  className="mr-2 text-blue-200 hover:text-white transition-colors"
                  aria-label="Play audio"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                </button>
                <p>• tomato → <span className="font-bold">tomatoes</span></p>
              </div>
              <div className="flex items-center group">
                <button 
                  onClick={() => playAudio("sandwiches")}
                  className="mr-2 text-blue-200 hover:text-white transition-colors"
                  aria-label="Play audio"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                </button>
                <p>• sandwich → <span className="font-bold">sandwiches</span></p>
              </div>
              <div className="flex items-center group">
                <button 
                  onClick={() => playAudio("fries")}
                  className="mr-2 text-blue-200 hover:text-white transition-colors"
                  aria-label="Play audio"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                </button>
                <p>• French fries → <span className="font-bold">fries</span></p>
              </div>
            </div>
          </div>
        </div>

        {/* Botão para próxima lição */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={() => router.push("/cursos/lesson4")}
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-8 rounded-full transition-colors"
          >
            &larr; Lição Anterior
          </button>
          <button
            onClick={() => router.push("/cursos/lesson6")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full transition-colors"
          >
            Próxima Lição &rarr;
          </button>
        </div>  
      </div>
    </div>
  );
}