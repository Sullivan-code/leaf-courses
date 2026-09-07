"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type SectionKey = 'verbs' | 'vocabulary' | 'usefulPhrases' | 'grammar';

export default function Lesson5FoodAndDrink() {
  const router = useRouter();
  const [openDrills, setOpenDrills] = useState({
    verbs: false,
    vocabulary: false,
    usefulPhrases: false,
    grammar: false,
  });
  
  // Estado para o modal de anotações do professor
  const [noteModal, setNoteModal] = useState({ isOpen: false, text: "" });
  // Estado para as anotações salvas que aparecem na tela
  const [teacherNotes, setTeacherNotes] = useState<string[]>([]);

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
      .replace(/\s*\/\s*/g, '-or-')
      .trim();
    
    const audio = new Audio(`/audios/${formattedText}.mp3`);
    audio.play().catch(e => console.error("Erro ao reproduzir áudio:", e));
  };

  // Função para abrir o modal de anotações do professor
  const openNoteModal = () => {
    setNoteModal({ isOpen: true, text: "" });
  };

  // Função para fechar o modal de anotações
  const closeNoteModal = () => {
    setNoteModal({ isOpen: false, text: "" });
  };

  // Função para salvar a anotação do professor e exibir na tela
  const saveNote = () => {
    if (noteModal.text.trim()) {
      setTeacherNotes([...teacherNotes, noteModal.text]);
      closeNoteModal();
    } else {
      alert("Por favor, digite uma anotação antes de salvar.");
    }
  };

  // Função para remover uma anotação
  const removeNote = (index: number) => {
    setTeacherNotes(teacherNotes.filter((_, i) => i !== index));
  };

  // URLs das imagens
  const mainImage = "https://i.ibb.co/tTpRLxNr/l5-main.jpg";
  const beefAndFishImage = "https://i.ibb.co/N6P2sn5P/beef-and-fish.jpg";
  const drinkAndSandwichImage = "https://i.ibb.co/5xwfgP0Y/drink-and-sandwich.jpg";
  const vegetablesImage = "https://i.ibb.co/whTg289T/vegetables.jpg";

  return (
    <div
      className="min-h-screen rounded-2xl py-16 px-6 bg-fixed relative"
      style={{
        backgroundImage: `url("/images/l5-orange-juice.jpg")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Ícone de lápis fixo para professores - APENAS UM na página toda */}
      <button 
        onClick={openNoteModal}
        className="fixed bottom-6 right-6 bg-yellow-500 hover:bg-yellow-600 text-white p-4 rounded-full shadow-lg transition-all duration-300 z-50"
        aria-label="Fazer anotação para a turma"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      </button>

      {/* Área de anotações do professor que aparecem na tela */}
      {teacherNotes.length > 0 && (
        <div className="fixed top-20 right-6 bg-white rounded-lg shadow-lg p-4 max-w-sm z-40 border-l-4 border-yellow-500">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-bold text-gray-700">📝 Anotações do Professor</h4>
            <button 
              onClick={() => setTeacherNotes([])}
              className="text-xs text-gray-400 hover:text-gray-600"
            >
              Limpar todas
            </button>
          </div>
          <div className="space-y-2">
            {teacherNotes.map((note, index) => (
              <div key={index} className="bg-gray-50 p-2 rounded text-sm text-gray-600 flex justify-between items-start">
                <span>{note}</span>
                <button 
                  onClick={() => removeNote(index)}
                  className="text-red-400 hover:text-red-600 ml-2"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto bg-[#f0f8ff] bg-opacity-95 rounded-[40px] p-10 shadow-lg">
        
        {/* Título centralizado com imagem abaixo */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-[#0c4a6e] mb-6">
            Leçon 5 – Nourriture et Boissons
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            Apprenez à exprimer vos préférences en matière de nourriture et de boissons en français. 🍖🥗
          </p>
          <div className="w-64 h-64 mx-auto">
            <img
              src={mainImage}
              alt="Nourriture et boissons"
              className="w-full h-full object-cover rounded-2xl shadow-md"
            />
          </div>
        </div>

        {/* Seção 1 - Verbes avec Drill */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Verbes</h2>
              <p className="mt-2 text-blue-100 italic">
                Cliquez sur les verbes pour écouter la prononciation et pratiquer leurs formes
              </p>
            </div>
            <button 
              onClick={() => toggleDrill('verbs')}
              className="inline-block rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 text-sm transition-all duration-300 hover:from-purple-600 hover:to-purple-800 active:animate-glow"
            >
              {openDrills.verbs ? 'Ocultar Exercício' : 'Mostrar Exercício'}
            </button>
          </div>
          
          <div className="p-8">
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
              <li>
                <button 
                  onClick={() => playAudio('préférer')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  préférer
                </button> = preferir
              </li>
              <li>
                <button 
                  onClick={() => playAudio('adorer')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  adorer
                </button> = amar, adorar
              </li>
            </ul>
            
            {openDrills.verbs && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">Je préfère <span className="text-blue-600 font-bold">le jus</span>. / <span className="text-blue-600 font-bold">le soda</span> / <span className="text-blue-600 font-bold">la tisane à la camomille</span></p>
                  <p className="text-sm text-gray-500 mt-1">Eu prefiro suco. / refrigerante / chá de camomila</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">Préférez-vous <span className="text-blue-600 font-bold">le riz</span> ou <span className="text-blue-600 font-bold">les haricots</span> ? / <span className="text-blue-600 font-bold">la viande</span> ou <span className="text-blue-600 font-bold">le poisson</span> / <span className="text-blue-600 font-bold">le poulet</span> ou <span className="text-blue-600 font-bold">la salade</span></p>
                  <p className="text-sm text-gray-500 mt-1">Você prefere arroz ou feijão? / carne ou peixe / frango ou salada</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">Ils préfèrent <span className="text-blue-600 font-bold">le pain</span> et le beurre. / <span className="text-blue-600 font-bold">les œufs</span> / <span className="text-blue-600 font-bold">les frites</span></p>
                  <p className="text-sm text-gray-500 mt-1">Eles preferem pão com manteiga. / ovos / batata frita</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">Nous préférons <span className="text-blue-600 font-bold">la salade</span>. / <span className="text-blue-600 font-bold">les légumes</span> / <span className="text-blue-600 font-bold">les légumes verts</span></p>
                  <p className="text-sm text-gray-500 mt-1">Nós preferimos salada. / legumes / verduras</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">Elle préfère <span className="text-blue-600 font-bold">le poisson</span>. / <span className="text-blue-600 font-bold">le poulet</span> / <span className="text-blue-600 font-bold">la viande</span></p>
                  <p className="text-sm text-gray-500 mt-1">Ela prefere peixe. / frango / carne</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">J'<span className="text-blue-600 font-bold">adore</span> la pizza. / <span className="text-blue-600 font-bold">le hamburger</span> / <span className="text-blue-600 font-bold">le chocolat</span></p>
                  <p className="text-sm text-gray-500 mt-1">Eu adoro pizza. / hambúrguer / chocolate</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600 font-bold">Adorez-vous</span> la glace ? / <span className="text-blue-600 font-bold">le gâteau</span> / <span className="text-blue-600 font-bold">les bonbons</span></p>
                  <p className="text-sm text-gray-500 mt-1">Você adora sorvete? / bolo / doces</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">Ils <span className="text-blue-600 font-bold">adorent</span> les frites. / <span className="text-blue-600 font-bold">les sandwichs</span> / <span className="text-blue-600 font-bold">le soda</span></p>
                  <p className="text-sm text-gray-500 mt-1">Eles adoram batatas fritas. / sanduíches / refrigerante</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">Nous <span className="text-blue-600 font-bold">adorons</span> la cuisine italienne. / <span className="text-blue-600 font-bold">japonaise</span> / <span className="text-blue-600 font-bold">mexicaine</span></p>
                  <p className="text-sm text-gray-500 mt-1">Nós adoramos comida italiana. / japonesa / mexicana</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">Elle <span className="text-blue-600 font-bold">adore</span> le café. / <span className="text-blue-600 font-bold">le thé</span> / <span className="text-blue-600 font-bold">les jus naturels</span></p>
                  <p className="text-sm text-gray-500 mt-1">Ela adora café. / chá / sucos naturais</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">Je <span className="text-blue-600 font-bold">préfère manger</span> des fruits. / <span className="text-blue-600 font-bold">des légumes</span> / <span className="text-blue-600 font-bold">des aliments sains</span></p>
                  <p className="text-sm text-gray-500 mt-1">Eu prefiro comer frutas. / vegetais / alimentos saudáveis</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600 font-bold">Préférez-vous boire</span> de l'eau ou du jus ? / <span className="text-blue-600 font-bold">du thé ou du café</span></p>
                  <p className="text-sm text-gray-500 mt-1">Você prefere beber água ou suco? / chá ou café</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Seção 2 - Vocabulaire avec Drill */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Nouveaux Mots</h2>
              <p className="mt-2 text-blue-100 italic">
                Cliquez sur chaque mot pour écouter sa prononciation correcte
              </p>
            </div>
            <button 
              onClick={() => toggleDrill('vocabulary')}
              className="inline-block rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 text-sm transition-all duration-300 hover:from-purple-600 hover:to-purple-800 active:animate-glow"
            >
              {openDrills.vocabulary ? 'Ocultar Exercício' : 'Mostrar Exercício'}
            </button>
          </div>
          
          <div className="p-8">
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <li>
                <button onClick={() => playAudio('bœuf')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors">bœuf</button> = carne bovina
              </li>
              <li>
                <button onClick={() => playAudio('poulet')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors">poulet</button> = frango
              </li>
              <li>
                <button onClick={() => playAudio('poisson')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors">poisson</button> = peixe
              </li>
              <li>
                <button onClick={() => playAudio('bacon')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors">bacon</button> = bacon
              </li>
              <li>
                <button onClick={() => playAudio('saucisse')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors">saucisse</button> = linguiça, salsicha
              </li>
              <li>
                <button onClick={() => playAudio('tomate')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors">tomate</button> = tomate
              </li>
              <li>
                <button onClick={() => playAudio('salade')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors">salade</button> = salada
              </li>
              <li>
                <button onClick={() => playAudio('frites')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors">frites</button> = batatas fritas
              </li>
              <li>
                <button onClick={() => playAudio('sandwich')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors">sandwich</button> = sanduíche
              </li>
              <li>
                <button onClick={() => playAudio('légumes')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors">légumes</button> = legumes, verduras
              </li>
              <li>
                <button onClick={() => playAudio('riz')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors">riz</button> = arroz
              </li>
              <li>
                <button onClick={() => playAudio('haricots')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors">haricots</button> = feijão
              </li>
              <li>
                <button onClick={() => playAudio('soda')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors">soda</button> = refrigerante
              </li>
              <li>
                <button onClick={() => playAudio('ou')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors">ou</button> = ou
              </li>
              <li>
                <button onClick={() => playAudio('quoi')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors">quoi</button> = o que, qual
              </li>
            </ul>
            
            {openDrills.vocabulary && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">1. Je préfère <span className="text-blue-600 font-bold">le bœuf</span>. / <span className="text-blue-600 font-bold">le poulet</span> / <span className="text-blue-600 font-bold">le poisson</span></p>
                  <p className="text-sm text-gray-500 mt-1">Eu prefiro carne bovina. / frango / peixe</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">2. Voulez-vous du <span className="text-blue-600 font-bold">bacon</span> avec des œufs ? / <span className="text-blue-600 font-bold">de la saucisse</span> / <span className="text-blue-600 font-bold">de la tomate</span></p>
                  <p className="text-sm text-gray-500 mt-1">Você quer bacon com ovos? / salsicha / tomate</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">3. Nous adorons <span className="text-blue-600 font-bold">la salade</span>. / <span className="text-blue-600 font-bold">les légumes</span> / <span className="text-blue-600 font-bold">les frites</span></p>
                  <p className="text-sm text-gray-500 mt-1">Nós adoramos salada. / legumes / batatas fritas</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">4. Je veux un <span className="text-blue-600 font-bold">sandwich</span>. / <span className="text-blue-600 font-bold">une salade</span> / <span className="text-blue-600 font-bold">un plat de poisson</span></p>
                  <p className="text-sm text-gray-500 mt-1">Eu quero um sanduíche. / salada / prato com peixe</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">5. Préférez-vous la <span className="text-blue-600 font-bold">tomate</span> dans votre salade ? / <span className="text-blue-600 font-bold">le bacon</span> / <span className="text-blue-600 font-bold">la saucisse</span></p>
                  <p className="text-sm text-gray-500 mt-1">Você prefere tomate na salada? / bacon / salsicha</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">6. La nourriture est dans le <span className="text-blue-600 font-bold">réfrigérateur</span>. / <span className="text-blue-600 font-bold">congélateur</span> / <span className="text-blue-600 font-bold">placard</span></p>
                  <p className="text-sm text-gray-500 mt-1">A comida está na geladeira. / freezer / armário</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">7. Voulez-vous de la viande <span className="text-blue-600 font-bold">ou</span> du poulet ? / <span className="text-blue-600 font-bold">du poisson</span> / <span className="text-blue-600 font-bold">de la salade</span></p>
                  <p className="text-sm text-gray-500 mt-1">Você quer carne ou frango? / peixe / salada</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">8. <span className="text-blue-600 font-bold">Que</span> voulez-vous manger ? / <span className="text-blue-600 font-bold">boire</span> / <span className="text-blue-600 font-bold">préférer</span></p>
                  <p className="text-sm text-gray-500 mt-1">O que você quer comer? / beber / preferir</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">9. J'adore les <span className="text-blue-600 font-bold">sandwichs</span>. / <span className="text-blue-600 font-bold">frites</span> / <span className="text-blue-600 font-bold">pizzas</span></p>
                  <p className="text-sm text-gray-500 mt-1">Eu adoro sanduíches. / batatas fritas / pizza</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">10. Ils préfèrent les <span className="text-blue-600 font-bold">légumes cuits</span>. / <span className="text-blue-600 font-bold">crus</span> / <span className="text-blue-600 font-bold">grillés</span></p>
                  <p className="text-sm text-gray-500 mt-1">Eles preferem vegetais cozidos. / crus / grelhados</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Seção 3 - Phrases Utiles avec Drill */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Parlez comme un natif</h2>
              <p className="mt-2 text-blue-100 italic">
                Pratiquez des phrases courantes pour exprimer vos préférences alimentaires
              </p>
            </div>
            <button 
              onClick={() => toggleDrill('usefulPhrases')}
              className="inline-block rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 text-sm transition-all duration-300 hover:from-purple-600 hover:to-purple-800 active:animate-glow"
            >
              {openDrills.usefulPhrases ? 'Ocultar Exercício' : 'Mostrar Exercício'}
            </button>
          </div>
          
          <div className="p-8">
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
              <li>
                <button onClick={() => playAudio('je-veux-un-verre-deau-sil-vous-plaît')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors">Je veux un verre d'eau, s'il vous plaît.</button> = Eu quero um copo de água, por favor.
              </li>
              <li>
                <button onClick={() => playAudio('je-préfère-une-tasse-de-thé')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors">Je préfère une tasse de thé.</button> = Eu prefiro uma xícara de chá.
              </li>
              <li>
                <button onClick={() => playAudio('nous-adorons-le-riz-et-les-haricots-pour-le-déjeuner')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors">Nous adorons le riz et les haricots pour le déjeuner.</button> = Nós adoramos arroz e feijão no almoço.
              </li>
              <li>
                <button onClick={() => playAudio('je-mange-du-pain-et-des-œufs-pour-le-petit-déjeuner')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors">Je mange du pain et des œufs pour le petit-déjeuner.</button> = Eu como pão e ovos no café da manhã.
              </li>
              <li>
                <button onClick={() => playAudio('je-préfère-le-poisson-pour-le-dîner')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors">Je préfère le poisson pour le dîner.</button> = Eu prefiro peixe no jantar.
              </li>
              <li>
                <button onClick={() => playAudio('que-préférez-vous-manger')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors">Que préférez-vous manger ?</button> = O que você prefere comer?
              </li>
              <li>
                <button onClick={() => playAudio('que-voulez-vous-boire')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors">Que voulez-vous boire ?</button> = O que você quer beber?
              </li>
              <li>
                <button onClick={() => playAudio('jadore-la-pizza-pour-le-dîner')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors">J'adore la pizza pour le dîner.</button> = Eu adoro pizza no jantar.
              </li>
            </ul>
            
            {openDrills.usefulPhrases && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">1. Je veux un verre d'<span className="text-blue-600 font-bold">eau</span>, s'il vous plaît. / <span className="text-blue-600 font-bold">jus</span> / <span className="text-blue-600 font-bold">lait</span></p>
                  <p className="text-sm text-gray-500 mt-1">Eu quero um copo de água, por favor. / suco / leite</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">2. Je veux une tasse de <span className="text-blue-600 font-bold">thé</span>. / <span className="text-blue-600 font-bold">café</span> / <span className="text-blue-600 font-bold">chocolat chaud</span></p>
                  <p className="text-sm text-gray-500 mt-1">Eu quero uma xícara de chá. / café / chocolate quente</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">3. Je mange du <span className="text-blue-600 font-bold">riz et des haricots</span> pour le déjeuner. / <span className="text-blue-600 font-bold">de la viande et de la salade</span> / <span className="text-blue-600 font-bold">du poisson et des légumes</span></p>
                  <p className="text-sm text-gray-500 mt-1">Eu como arroz e feijão no almoço. / carne e salada / peixe e legumes</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">4. Je mange du <span className="text-blue-600 font-bold">pain et des œufs</span> pour le petit-déjeuner. / <span className="text-blue-600 font-bold">des céréales et du lait</span> / <span className="text-blue-600 font-bold">des fruits et du yaourt</span></p>
                  <p className="text-sm text-gray-500 mt-1">Eu como pão com ovos no café da manhã. / cereal com leite / frutas com iogurte</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">5. Je <span className="text-blue-600 font-bold">préfère</span> le poisson pour le dîner. / <span className="text-blue-600 font-bold">le poulet</span> / <span className="text-blue-600 font-bold">la salade</span></p>
                  <p className="text-sm text-gray-500 mt-1">Eu prefiro peixe no jantar. / frango / salada</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">6. <span className="text-blue-600 font-bold">Que</span> voulez-vous manger ? / <span className="text-blue-600 font-bold">boire</span> / <span className="text-blue-600 font-bold">prendre pour le dîner</span></p>
                  <p className="text-sm text-gray-500 mt-1">O que você quer comer? / beber / jantar</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">7. <span className="text-blue-600 font-bold">Que</span> voulez-vous pour le déjeuner ? / <span className="text-blue-600 font-bold">le dîner</span> / <span className="text-blue-600 font-bold">le petit-déjeuner</span></p>
                  <p className="text-sm text-gray-500 mt-1">O que você quer para o almoço? / jantar / café da manhã</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">8. J'<span className="text-blue-600 font-bold">adore</span> la pizza pour le dîner. / <span className="text-blue-600 font-bold">les pâtes</span> / <span className="text-blue-600 font-bold">la cuisine japonaise</span></p>
                  <p className="text-sm text-gray-500 mt-1">Eu adoro pizza no jantar. / massa / comida japonesa</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">9. <span className="text-blue-600 font-bold">Préférez-vous</span> la viande ou le poulet pour le dîner ? / <span className="text-blue-600 font-bold">le poisson</span> / <span className="text-blue-600 font-bold">la salade</span></p>
                  <p className="text-sm text-gray-500 mt-1">Você prefere carne ou frango no jantar? / peixe / salada</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">10. Nous <span className="text-blue-600 font-bold">adorons</span> le dessert après le dîner. / <span className="text-blue-600 font-bold">le café</span> / <span className="text-blue-600 font-bold">le thé</span></p>
                  <p className="text-sm text-gray-500 mt-1">Nós amamos sobremesa depois do jantar. / café / chá</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Seção 4 - Grammaire avec Drill */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">GRAMMAIRE</h2>
              <p className="mt-2 text-blue-100 italic">
                Structures pour poser des questions et répondre sur les préférences alimentaires
              </p>
            </div>
            <button 
              onClick={() => toggleDrill('grammar')}
              className="inline-block rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 text-sm transition-all duration-300 hover:from-purple-600 hover:to-purple-800 active:animate-glow"
            >
              {openDrills.grammar ? 'Ocultar Exercício' : 'Mostrar Exercício'}
            </button>
          </div>
          
          <div className="p-8">
            <div className="bg-blue-50 p-4 rounded-[20px] text-gray-800 space-y-3 mb-6">
              <p>
                <button onClick={() => playAudio('mangez-vous-du-poisson')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors">Mangez-vous du poisson ?</button> = Você come peixe?
              </p>
              <p>
                <button onClick={() => playAudio('voulez-vous-manger-des-frites')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors">Voulez-vous manger des frites ?</button> = Você quer comer batatas fritas?
              </p>
              <p>
                <button onClick={() => playAudio('mangez-vous-du-pain-pour-le-petit-déjeuner')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors">Mangez-vous du pain pour le petit-déjeuner ?</button> = Você come pão no café da manhã?
              </p>
              <p>
                <button onClick={() => playAudio('que-mangez-vous-pour-le-dîner')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors">Que mangez-vous pour le dîner ?</button> = O que você come no jantar?
              </p>
              <p>
                <button onClick={() => playAudio('que-voulez-vous-boire')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors">Que voulez-vous boire ?</button> = O que você quer beber?
              </p>
              <p>
                <button onClick={() => playAudio('qu-aimez-vous-manger')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors">Qu'aimez-vous manger ?</button> = O que você gosta de comer?
              </p>
              <p>
                <button onClick={() => playAudio('préférez-vous-le-café-ou-le-thé')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors">Préférez-vous le café ou le thé ?</button> = Você prefere café ou chá?
              </p>
              <p>
                <button onClick={() => playAudio('adorez-vous-le-chocolat')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors">Adorez-vous le chocolat ?</button> = Você adora chocolate?
              </p>
            </div>
            
            {openDrills.grammar && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">1. <span className="text-blue-600 font-bold">Mangez-vous</span> du pain ? / <span className="text-blue-600 font-bold">du riz</span> / <span className="text-blue-600 font-bold">des œufs</span> / <span className="text-blue-600 font-bold">de la salade</span> / <span className="text-blue-600 font-bold">du poisson</span></p>
                  <p className="text-sm text-gray-500 mt-1">Você come pão? / arroz / ovos / salada / peixe</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">2. <span className="text-blue-600 font-bold">Buvez-vous</span> du jus ? / <span className="text-blue-600 font-bold">du soda</span> / <span className="text-blue-600 font-bold">du thé</span> / <span className="text-blue-600 font-bold">du café</span> / <span className="text-blue-600 font-bold">du lait</span></p>
                  <p className="text-sm text-gray-500 mt-1">Você bebe suco? / refrigerante / chá / café / leite</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">3. <span className="text-blue-600 font-bold">Voulez-vous</span> de l'eau ? / <span className="text-blue-600 font-bold">du soda</span> / <span className="text-blue-600 font-bold">du riz</span> / <span className="text-blue-600 font-bold">des haricots</span> / <span className="text-blue-600 font-bold">de la saucisse</span></p>
                  <p className="text-sm text-gray-500 mt-1">Você quer água? / refrigerante / arroz / feijão / salsicha</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">4. <span className="text-blue-600 font-bold">Aimez-vous</span> la salade ? / <span className="text-blue-600 font-bold">le poisson</span> / <span className="text-blue-600 font-bold">le poulet</span> / <span className="text-blue-600 font-bold">les frites</span> / <span className="text-blue-600 font-bold">la viande</span></p>
                  <p className="text-sm text-gray-500 mt-1">Você gosta de salada? / peixe / frango / batatas fritas / carne</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">5. <span className="text-blue-600 font-bold">Mangez-vous</span> du poulet ? / <span className="text-blue-600 font-bold">du poisson</span> / <span className="text-blue-600 font-bold">de la viande</span> / <span className="text-blue-600 font-bold">des légumes</span> / <span className="text-blue-600 font-bold">de la saucisse</span></p>
                  <p className="text-sm text-gray-500 mt-1">Você come frango? / peixe / carne / legumes / salsicha</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">6. <span className="text-blue-600 font-bold">Buvez-vous</span> du soda ? / <span className="text-blue-600 font-bold">du jus</span> / <span className="text-blue-600 font-bold">du lait</span> / <span className="text-blue-600 font-bold">de l'eau</span> / <span className="text-blue-600 font-bold">du thé</span></p>
                  <p className="text-sm text-gray-500 mt-1">Você bebe refrigerante? / suco / leite / água / chá</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">7. <span className="text-blue-600 font-bold">Aimez-vous</span> les sandwichs ? / <span className="text-blue-600 font-bold">les tomates</span> / <span className="text-blue-600 font-bold">la salade</span> / <span className="text-blue-600 font-bold">le bacon</span> / <span className="text-blue-600 font-bold">les haricots</span></p>
                  <p className="text-sm text-gray-500 mt-1">Você gosta de sanduíches? / tomates / salada / bacon / feijão</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">8. <span className="text-blue-600 font-bold">Voulez-vous</span> du soda ? / <span className="text-blue-600 font-bold">du jus</span> / <span className="text-blue-600 font-bold">de l'eau</span> / <span className="text-blue-600 font-bold">de la viande</span> / <span className="text-blue-600 font-bold">des œufs</span></p>
                  <p className="text-sm text-gray-500 mt-1">Você quer refrigerante? / suco / água / carne / ovos</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">9. <span className="text-blue-600 font-bold">Préférez-vous</span> le riz ? / <span className="text-blue-600 font-bold">les haricots</span> / <span className="text-blue-600 font-bold">les frites</span> / <span className="text-blue-600 font-bold">la salade</span> / <span className="text-blue-600 font-bold">le bacon</span></p>
                  <p className="text-sm text-gray-500 mt-1">Você prefere arroz? / feijão / batatas fritas / salada / bacon</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">10. <span className="text-blue-600 font-bold">Préférez-vous manger</span> de la viande ? / <span className="text-blue-600 font-bold">du poisson</span> / <span className="text-blue-600 font-bold">du poulet</span> / <span className="text-blue-600 font-bold">de la saucisse</span></p>
                  <p className="text-sm text-gray-500 mt-1">Você prefere comer carne? / peixe / frango / salsicha</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">11. <span className="text-blue-600 font-bold">Adorez-vous</span> la pizza ? / <span className="text-blue-600 font-bold">le chocolat</span> / <span className="text-blue-600 font-bold">la glace</span></p>
                  <p className="text-sm text-gray-500 mt-1">Você adora pizza? / chocolate / sorvete</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">12. <span className="text-blue-600 font-bold">Préférez-vous</span> le café ou le thé ? / <span className="text-blue-600 font-bold">le jus ou le soda</span> / <span className="text-blue-600 font-bold">l'eau ou le lait</span></p>
                  <p className="text-sm text-gray-500 mt-1">Você prefere café ou chá? / suco ou refrigerante / água ou leite</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">13. <span className="text-blue-600 font-bold">Que préférez-vous manger</span> pour le dîner ? / <span className="text-blue-600 font-bold">le déjeuner</span> / <span className="text-blue-600 font-bold">le petit-déjeuner</span></p>
                  <p className="text-sm text-gray-500 mt-1">O que você prefere comer no jantar? / almoço / café da manhã</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">14. <span className="text-blue-600 font-bold">Qu'adorez-vous boire</span> le matin ? / <span className="text-blue-600 font-bold">l'après-midi</span> / <span className="text-blue-600 font-bold">le soir</span></p>
                  <p className="text-sm text-gray-500 mt-1">O que você adora beber pela manhã? / tarde / noite</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Seção 5 - Mise en pratique */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8">
            <h2 className="text-2xl font-bold">À VOUS !</h2>
            <p className="mt-2 text-blue-100 italic">
              Remplacez les mots pour pratiquer la prononciation dans des situations réelles
            </p>
          </div>
          
          <div className="p-8">
            <div className="bg-blue-50 rounded-[20px] p-6">
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Frases - 2/3 da largura em grandes */}
                <div className="lg:w-2/3 space-y-6">
                  <div>
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio('je-préfère-boire-un-verre-deau')} 
                        className="mr-3 mt-1 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828a1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          1. Je préfère boire un verre d'eau.
                        </p>
                        <p className="text-sm text-gray-600">Eu prefiro beber um copo de água.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio('je-préfère-manger-du-bœuf-et-des-légumes')} 
                        className="mr-3 mt-1 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828a1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          2. Je préfère manger du bœuf et des légumes.
                        </p>
                        <p className="text-sm text-gray-600">Eu prefiro comer carne bovina e legumes.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio('je-préfère-le-jus-au-soda')} 
                        className="mr-3 mt-1 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828a1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          3. Je préfère le jus au soda.
                        </p>
                        <p className="text-sm text-gray-600">Eu prefiro suco a refrigerante.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio('jadore-les-frites')} 
                        className="mr-3 mt-1 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828a1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          4. J'adore les frites.
                        </p>
                        <p className="text-sm text-gray-600">Eu adoro batatas fritas.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio('je-préfère-manger-du-poulet-et-de-la-salade-pour-le-déjeuner')} 
                        className="mr-3 mt-1 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828a1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          5. Je préfère manger du poulet et de la salade pour le déjeuner.
                        </p>
                        <p className="text-sm text-gray-600">Eu prefiro comer frango e salada no almoço.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio('aimez-vous-les-saucisses-et-le-bacon')} 
                        className="mr-3 mt-1 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828a1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          6. Aimez-vous les saucisses et le bacon ?
                        </p>
                        <p className="text-sm text-gray-600">Você gosta de salsichas e bacon?</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio('voulez-vous-boire-du-jus')} 
                        className="mr-3 mt-1 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828a1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          7. Voulez-vous boire du jus ?
                        </p>
                        <p className="text-sm text-gray-600">Você quer beber suco?</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio('préférez-vous-manger-du-poisson-ou-du-bœuf-pour-le-dîner')} 
                        className="mr-3 mt-1 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828a1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          8. Préférez-vous manger du poisson ou du bœuf pour le dîner ?
                        </p>
                        <p className="text-sm text-gray-600">Você prefere comer peixe ou carne bovina no jantar?</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio('qu-aimez-vous')} 
                        className="mr-3 mt-1 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828a1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          9. Qu'aimez-vous ?
                        </p>
                        <p className="text-sm text-gray-600">O que você gosta?</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio('que-voulez-vous-manger')} 
                        className="mr-3 mt-1 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828a1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          10. Que voulez-vous manger ?
                        </p>
                        <p className="text-sm text-gray-600">O que você quer comer?</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Container das imagens - 1/3 da largura em grandes */}
                <div className="lg:w-1/3 flex flex-col gap-4">
                  <div className="bg-white rounded-2xl p-4 shadow-md">
                    <div className="relative h-64 w-full">
                      <img
                        src={beefAndFishImage}
                        alt="Plats principaux"
                        className="rounded-xl object-cover w-full h-full"
                      />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">
                      Viandes, poisson et accompagnements
                    </p>
                  </div>
                  
                  <div className="bg-white rounded-2xl p-4 shadow-md">
                    <div className="relative h-64 w-full">
                      <img
                        src={drinkAndSandwichImage}
                        alt="Boissons et sandwichs"
                        className="rounded-xl object-cover w-full h-full"
                      />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">
                      Boissons et sandwichs variés
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Seção 6 - Récapitulons ! */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8">
            <h2 className="text-3xl font-bold">RÉCAPITULONS !</h2>
            <p className="mt-2 text-blue-100 italic">
              Pratiquez les structures essentielles pour parler des préférences alimentaires en complétant le reste des phrases.
            </p>
          </div>

          <div className="flex flex-col md:flex-row">
            {/* Coluna esquerda - Expressões */}
            <div className="bg-blue-900 text-white flex-1 p-6 space-y-4 text-xl">
              <p className="font-bold">J'aime manger... <span className="text-sm text-blue-300 ml-2">Eu gosto de comer...</span></p>
              <p className="font-bold">Je veux boire... <span className="text-sm text-blue-300 ml-2">Eu quero beber...</span></p>
              <p className="font-bold">Je n'aime pas manger... <span className="text-sm text-blue-300 ml-2">Eu não gosto de comer...</span></p>
              <p className="font-bold">Je ne veux pas boire... <span className="text-sm text-blue-300 ml-2">Eu não quero beber...</span></p>
            </div>

            {/* Coluna central - Imagem e balão */}
            <div className="bg-white flex-1 p-6 flex flex-col items-center justify-center text-xl">
              <img
                src={vegetablesImage}
                alt="Personne choisissant un plat"
                className="rounded-full w-40 h-40 object-cover mb-4"
              />
              <div className="bg-yellow-200 text-black px-4 py-2 rounded-xl shadow-md text-center">
                Que voulez-vous manger ? <span className="font-bold">Je veux du poulet !</span>
                <p className="text-sm text-gray-600 mt-1">O que você quer comer? Eu quero frango!</p>
              </div>
            </div>

            {/* Coluna direita - Au revoir */}
            <div className="bg-blue-900 text-white flex-1 p-6 space-y-4 text-xl">
              <div className="flex items-center group">
                <button 
                  onClick={() => playAudio("au-revoir-à-bientôt")}
                  className="mr-2 text-blue-200 hover:text-white transition-colors"
                  aria-label="Play audio"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                </button>
                <p>• Au revoir ! À bientôt. <span className="text-sm text-blue-300 ml-2">Tchau! Até mais.</span></p>
              </div>
              <div className="flex items-center group">
                <button 
                  onClick={() => playAudio("à-plus-tard")}
                  className="mr-2 text-blue-200 hover:text-white transition-colors"
                  aria-label="Play audio"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                </button>
                <p>• À plus tard. <span className="text-sm text-blue-300 ml-2">Até mais tarde.</span></p>
              </div>
              <div className="flex items-center group">
                <button 
                  onClick={() => playAudio("bonne-nuit")}
                  className="mr-2 text-blue-200 hover:text-white transition-colors"
                  aria-label="Play audio"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                </button>
                <p>• Bonne nuit ! <span className="text-sm text-blue-300 ml-2">Boa noite!</span></p>
              </div>
            </div>
          </div>
        </div>

        {/* Botões de navegação */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={() => router.push("/cursos/lesson4")}
            className="inline-block rounded-full bg-gradient-to-r from-gray-500 to-gray-600 text-white px-8 py-3 text-lg transition-all duration-300 hover:from-gray-600 hover:to-gray-800 active:animate-glow"
          >
            &larr; Aula Anterior
          </button>
          <button
            onClick={() => router.push("/cursos/lesson6")}
            className="inline-block rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 text-lg transition-all duration-300 hover:from-purple-600 hover:to-purple-800 active:animate-glow"
          >
            Próxima Aula &rarr;
          </button>
        </div>
      </div>

      {/* Modal de Anotações do Professor */}
      {noteModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-blue-800">📝 Anotação para a Turma</h3>
              <button 
                onClick={closeNoteModal}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <textarea
              value={noteModal.text}
              onChange={(e) => setNoteModal({ ...noteModal, text: e.target.value })}
              placeholder="Digite aqui sua anotação para a turma...&#10;Exemplo: Prestem atenção na pronúncia de 'préférer' !&#10;Ou: Revisem o vocabulário de alimentos para a próxima aula."
              className="w-full h-40 p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 resize-none"
            />
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={closeNoteModal}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={saveNote}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Salvar e Exibir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}