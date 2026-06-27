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
            Lesson 5 - Food & Drink
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            Learn to express preferences about food and drinks in English. 🍖🥗
          </p>
          <div className="w-64 h-64 mx-auto">
            <img
              src={mainImage}
              alt="Food and drink"
              className="w-full h-full object-cover rounded-2xl shadow-md"
            />
          </div>
        </div>

        {/* Seção 1 - Verbos com Drill */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Verbs</h2>
              <p className="mt-2 text-blue-100 italic">
                Click on the verbs to hear the pronunciation and practice their forms
              </p>
            </div>
            <button 
              onClick={() => toggleDrill('verbs')}
              className="inline-block rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 text-sm transition-all duration-300 hover:from-purple-600 hover:to-purple-800 active:animate-glow"
            >
              {openDrills.verbs ? 'Hide Exercise' : 'Show Exercise'}
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
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">I prefer <span className="text-blue-600 font-bold">juice</span>. / <span className="text-blue-600 font-bold">soda</span> / <span className="text-blue-600 font-bold">chamomile tea</span></p>
                  <p className="text-sm text-gray-500 mt-1">Eu prefiro suco. / refrigerante / chá de camomila</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">Do you prefer <span className="text-blue-600 font-bold">rice</span> or <span className="text-blue-600 font-bold">beans</span>? / <span className="text-blue-600 font-bold">meat</span> or <span className="text-blue-600 font-bold">fish</span> / <span className="text-blue-600 font-bold">chicken</span> or <span className="text-blue-600 font-bold">salad</span></p>
                  <p className="text-sm text-gray-500 mt-1">Você prefere arroz ou feijão? / carne ou peixe / frango ou salada</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">They prefer <span className="text-blue-600 font-bold">bread</span> with butter. / <span className="text-blue-600 font-bold">eggs</span> / <span className="text-blue-600 font-bold">French fries</span></p>
                  <p className="text-sm text-gray-500 mt-1">Eles preferem pão com manteiga. / ovos / batata frita</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">We prefer <span className="text-blue-600 font-bold">salad</span>. / <span className="text-blue-600 font-bold">vegetables</span> / <span className="text-blue-600 font-bold">greens</span></p>
                  <p className="text-sm text-gray-500 mt-1">Nós preferimos salada. / legumes / verduras</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">She prefers <span className="text-blue-600 font-bold">fish</span>. / <span className="text-blue-600 font-bold">chicken</span> / <span className="text-blue-600 font-bold">meat</span></p>
                  <p className="text-sm text-gray-500 mt-1">Ela prefere peixe. / frango / carne</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">I <span className="text-blue-600 font-bold">love</span> pizza. / <span className="text-blue-600 font-bold">hamburger</span> / <span className="text-blue-600 font-bold">chocolate</span></p>
                  <p className="text-sm text-gray-500 mt-1">Eu adoro pizza. / hambúrguer / chocolate</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">Do you <span className="text-blue-600 font-bold">love</span> ice cream? / <span className="text-blue-600 font-bold">cake</span> / <span className="text-blue-600 font-bold">sweets</span></p>
                  <p className="text-sm text-gray-500 mt-1">Você adora sorvete? / bolo / doces</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">They <span className="text-blue-600 font-bold">love</span> French fries. / <span className="text-blue-600 font-bold">sandwiches</span> / <span className="text-blue-600 font-bold">soda</span></p>
                  <p className="text-sm text-gray-500 mt-1">Eles adoram batatas fritas. / sanduíches / refrigerante</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">We <span className="text-blue-600 font-bold">love</span> Italian food. / <span className="text-blue-600 font-bold">Japanese</span> / <span className="text-blue-600 font-bold">Mexican</span></p>
                  <p className="text-sm text-gray-500 mt-1">Nós adoramos comida italiana. / japonesa / mexicana</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">She <span className="text-blue-600 font-bold">loves</span> coffee. / <span className="text-blue-600 font-bold">tea</span> / <span className="text-blue-600 font-bold">natural juices</span></p>
                  <p className="text-sm text-gray-500 mt-1">Ela adora café. / chá / sucos naturais</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">I <span className="text-blue-600 font-bold">prefer to eat</span> fruits. / <span className="text-blue-600 font-bold">vegetables</span> / <span className="text-blue-600 font-bold">healthy food</span></p>
                  <p className="text-sm text-gray-500 mt-1">Eu prefiro comer frutas. / vegetais / alimentos saudáveis</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">Do you <span className="text-blue-600 font-bold">prefer to drink</span> water or juice? / <span className="text-blue-600 font-bold">tea or coffee</span></p>
                  <p className="text-sm text-gray-500 mt-1">Você prefere beber água ou suco? / chá ou café</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Seção 2 - Vocabulário com Drill */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">New Words</h2>
              <p className="mt-2 text-blue-100 italic">
                Click on each word to hear its correct pronunciation
              </p>
            </div>
            <button 
              onClick={() => toggleDrill('vocabulary')}
              className="inline-block rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 text-sm transition-all duration-300 hover:from-purple-600 hover:to-purple-800 active:animate-glow"
            >
              {openDrills.vocabulary ? 'Hide Exercise' : 'Show Exercise'}
            </button>
          </div>
          
          <div className="p-8">
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <li>
                <button onClick={() => playAudio('beef')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors">beef</button> = carne bovina
              </li>
              <li>
                <button onClick={() => playAudio('chicken')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors">chicken</button> = frango
              </li>
              <li>
                <button onClick={() => playAudio('fish')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors">fish</button> = peixe
              </li>
              <li>
                <button onClick={() => playAudio('bacon')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors">bacon</button> = bacon
              </li>
              <li>
                <button onClick={() => playAudio('sausage')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors">sausage</button> = linguiça, salsicha
              </li>
              <li>
                <button onClick={() => playAudio('tomato')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors">tomato</button> = tomate
              </li>
              <li>
                <button onClick={() => playAudio('salad')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors">salad</button> = salada
              </li>
              <li>
                <button onClick={() => playAudio('french fries')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors">French fries</button> = batatas fritas
              </li>
              <li>
                <button onClick={() => playAudio('sandwich')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors">sandwich</button> = sanduíche
              </li>
              <li>
                <button onClick={() => playAudio('vegetables')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors">vegetables</button> = legumes, verduras
              </li>
              <li>
                <button onClick={() => playAudio('rice')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors">rice</button> = arroz
              </li>
              <li>
                <button onClick={() => playAudio('beans')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors">beans</button> = Feijão
              </li>
              <li>
                <button onClick={() => playAudio('soda')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors">soda</button> = Refrigerante
              </li>
              <li>
                <button onClick={() => playAudio('or')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors">or</button> = ou
              </li>
              <li>
                <button onClick={() => playAudio('what')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors">what</button> = o que, qual
              </li>
            </ul>
            
            {openDrills.vocabulary && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">1. I prefer <span className="text-blue-600 font-bold">beef</span>. / <span className="text-blue-600 font-bold">chicken</span> / <span className="text-blue-600 font-bold">fish</span></p>
                  <p className="text-sm text-gray-500 mt-1">Eu prefiro carne bovina. / frango / peixe</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">2. Do you want <span className="text-blue-600 font-bold">bacon</span> with eggs? / <span className="text-blue-600 font-bold">sausage</span> / <span className="text-blue-600 font-bold">tomato</span></p>
                  <p className="text-sm text-gray-500 mt-1">Você quer bacon com ovos? / salsicha / tomate</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">3. We love <span className="text-blue-600 font-bold">salad</span>. / <span className="text-blue-600 font-bold">vegetables</span> / <span className="text-blue-600 font-bold">French fries</span></p>
                  <p className="text-sm text-gray-500 mt-1">Nós adoramos salada. / legumes / batatas fritas</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">4. I want a <span className="text-blue-600 font-bold">sandwich</span>. / <span className="text-blue-600 font-bold">salad</span> / <span className="text-blue-600 font-bold">fish dish</span></p>
                  <p className="text-sm text-gray-500 mt-1">Eu quero um sanduíche. / salada / prato com peixe</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">5. Do you prefer <span className="text-blue-600 font-bold">tomato</span> in your salad? / <span className="text-blue-600 font-bold">bacon</span> / <span className="text-blue-600 font-bold">sausage</span></p>
                  <p className="text-sm text-gray-500 mt-1">Você prefere tomate na salada? / bacon / salsicha</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">6. The food is in the <span className="text-blue-600 font-bold">refrigerator</span>. / <span className="text-blue-600 font-bold">freezer</span> / <span className="text-blue-600 font-bold">cupboard</span></p>
                  <p className="text-sm text-gray-500 mt-1">A comida está na geladeira. / freezer / armário</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">7. Do you want meat <span className="text-blue-600 font-bold">or</span> chicken? / <span className="text-blue-600 font-bold">fish</span> / <span className="text-blue-600 font-bold">salad</span></p>
                  <p className="text-sm text-gray-500 mt-1">Você quer carne ou frango? / peixe / salada</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">8. <span className="text-blue-600 font-bold">What</span> do you want to eat? / <span className="text-blue-600 font-bold">drink</span> / <span className="text-blue-600 font-bold">prefer</span></p>
                  <p className="text-sm text-gray-500 mt-1">O que você quer comer? / beber / preferir</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">9. I love <span className="text-blue-600 font-bold">sandwiches</span>. / <span className="text-blue-600 font-bold">French fries</span> / <span className="text-blue-600 font-bold">pizza</span></p>
                  <p className="text-sm text-gray-500 mt-1">Eu adoro sanduíches. / batatas fritas / pizza</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">10. They prefer cooked <span className="text-blue-600 font-bold">vegetables</span>. / <span className="text-blue-600 font-bold">raw</span> / <span className="text-blue-600 font-bold">grilled</span></p>
                  <p className="text-sm text-gray-500 mt-1">Eles preferem vegetais cozidos. / crus / grelhados</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Seção 3 - Frases Úteis com Drill */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Speak Like A Native</h2>
              <p className="mt-2 text-blue-100 italic">
                Practice common phrases to express food preferences
              </p>
            </div>
            <button 
              onClick={() => toggleDrill('usefulPhrases')}
              className="inline-block rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 text-sm transition-all duration-300 hover:from-purple-600 hover:to-purple-800 active:animate-glow"
            >
              {openDrills.usefulPhrases ? 'Hide Exercise' : 'Show Exercise'}
            </button>
          </div>
          
          <div className="p-8">
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
              <li>
                <button onClick={() => playAudio('i want a glass of water please')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors">I want a glass of water, please.</button> = Eu quero um copo de água, por favor.
              </li>
              <li>
                <button onClick={() => playAudio('i prefer a cup of tea')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors">I prefer a cup of tea.</button> = Eu prefiro uma xícara de chá.
              </li>
              <li>
                <button onClick={() => playAudio('we love rice and beans for lunch')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors">We love rice and beans for lunch.</button> = Nós adoramos arroz e feijão no almoço.
              </li>
              <li>
                <button onClick={() => playAudio('i eat bread and eggs for breakfast')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors">I eat bread and eggs for breakfast.</button> = Eu como pão e ovos no café da manhã.
              </li>
              <li>
                <button onClick={() => playAudio('i prefer fish for dinner')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors">I prefer fish for dinner.</button> = Eu prefiro peixe no jantar.
              </li>
              <li>
                <button onClick={() => playAudio('what do you prefer to eat')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors">What do you prefer to eat?</button> = O que você prefere comer?
              </li>
              <li>
                <button onClick={() => playAudio('what do you want to drink')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors">What do you want to drink?</button> = O que você quer beber?
              </li>
              <li>
                <button onClick={() => playAudio('i love pizza for dinner')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors">I love pizza for dinner.</button> = Eu adoro pizza no jantar.
              </li>
            </ul>
            
            {openDrills.usefulPhrases && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">1. I want a glass of <span className="text-blue-600 font-bold">water</span>, please. / <span className="text-blue-600 font-bold">juice</span> / <span className="text-blue-600 font-bold">milk</span></p>
                  <p className="text-sm text-gray-500 mt-1">Eu quero um copo de água, por favor. / suco / leite</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">2. I want a cup of <span className="text-blue-600 font-bold">tea</span>. / <span className="text-blue-600 font-bold">coffee</span> / <span className="text-blue-600 font-bold">hot chocolate</span></p>
                  <p className="text-sm text-gray-500 mt-1">Eu quero uma xícara de chá. / café / chocolate quente</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">3. I eat <span className="text-blue-600 font-bold">rice and beans</span> for lunch. / <span className="text-blue-600 font-bold">meat and salad</span> / <span className="text-blue-600 font-bold">fish and vegetables</span></p>
                  <p className="text-sm text-gray-500 mt-1">Eu como arroz e feijão no almoço. / carne e salada / peixe e legumes</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">4. I eat <span className="text-blue-600 font-bold">bread and eggs</span> for breakfast. / <span className="text-blue-600 font-bold">cereal and milk</span> / <span className="text-blue-600 font-bold">fruits and yogurt</span></p>
                  <p className="text-sm text-gray-500 mt-1">Eu como pão com ovos no café da manhã. / cereal com leite / frutas com iogurte</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">5. I <span className="text-blue-600 font-bold">prefer</span> fish for dinner. / <span className="text-blue-600 font-bold">chicken</span> / <span className="text-blue-600 font-bold">salad</span></p>
                  <p className="text-sm text-gray-500 mt-1">Eu prefiro peixe no jantar. / frango / salada</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">6. <span className="text-blue-600 font-bold">What</span> do you want to eat? / <span className="text-blue-600 font-bold">drink</span> / <span className="text-blue-600 font-bold">have for dinner</span></p>
                  <p className="text-sm text-gray-500 mt-1">O que você quer comer? / beber / jantar</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">7. <span className="text-blue-600 font-bold">What</span> do you want for lunch? / <span className="text-blue-600 font-bold">dinner</span> / <span className="text-blue-600 font-bold">breakfast</span></p>
                  <p className="text-sm text-gray-500 mt-1">O que você quer para o almoço? / jantar / café da manhã</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">8. I <span className="text-blue-600 font-bold">love</span> pizza for dinner. / <span className="text-blue-600 font-bold">pasta</span> / <span className="text-blue-600 font-bold">Japanese food</span></p>
                  <p className="text-sm text-gray-500 mt-1">Eu adoro pizza no jantar. / massa / comida japonesa</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">9. Do you <span className="text-blue-600 font-bold">prefer</span> meat or chicken for dinner? / <span className="text-blue-600 font-bold">fish</span> / <span className="text-blue-600 font-bold">salad</span></p>
                  <p className="text-sm text-gray-500 mt-1">Você prefere carne ou frango no jantar? / peixe / salada</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">10. We <span className="text-blue-600 font-bold">love</span> dessert after dinner. / <span className="text-blue-600 font-bold">coffee</span> / <span className="text-blue-600 font-bold">tea</span></p>
                  <p className="text-sm text-gray-500 mt-1">Nós amamos sobremesa depois do jantar. / café / chá</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Seção 4 - Gramática com Drill */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">GRAMMAR</h2>
              <p className="mt-2 text-blue-100 italic">
                Structures to ask and answer about food preferences
              </p>
            </div>
            <button 
              onClick={() => toggleDrill('grammar')}
              className="inline-block rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 text-sm transition-all duration-300 hover:from-purple-600 hover:to-purple-800 active:animate-glow"
            >
              {openDrills.grammar ? 'Hide Exercise' : 'Show Exercise'}
            </button>
          </div>
          
          <div className="p-8">
            <div className="bg-blue-50 p-4 rounded-[20px] text-gray-800 space-y-3 mb-6">
              <p>
                <button onClick={() => playAudio('do you eat fish')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors">Do you eat fish?</button> = Você come peixe?
              </p>
              <p>
                <button onClick={() => playAudio('do you want to eat french fries')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors">Do you want to eat French fries?</button> = Você quer comer batatas fritas?
              </p>
              <p>
                <button onClick={() => playAudio('do you eat bread for breakfast')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors">Do you eat bread for breakfast?</button> = Você come pão no café da manhã?
              </p>
              <p>
                <button onClick={() => playAudio('what do you eat for dinner')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors">What do you eat for dinner?</button> = O que você come no jantar?
              </p>
              <p>
                <button onClick={() => playAudio('what do you want to drink')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors">What do you want to drink?</button> = O que você quer beber?
              </p>
              <p>
                <button onClick={() => playAudio('what do you like to eat')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors">What do you like to eat?</button> = O que você gosta de comer?
              </p>
              <p>
                <button onClick={() => playAudio('do you prefer coffee or tea')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors">Do you prefer coffee or tea?</button> = Você prefere café ou chá?
              </p>
              <p>
                <button onClick={() => playAudio('do you love chocolate')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors">Do you love chocolate?</button> = Você adora chocolate?
              </p>
            </div>
            
            {openDrills.grammar && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">1. <span className="text-blue-600 font-bold">Do you eat</span> bread? / <span className="text-blue-600 font-bold">rice</span> / <span className="text-blue-600 font-bold">eggs</span> / <span className="text-blue-600 font-bold">salad</span> / <span className="text-blue-600 font-bold">fish</span></p>
                  <p className="text-sm text-gray-500 mt-1">Você come pão? / arroz / ovos / salada / peixe</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">2. <span className="text-blue-600 font-bold">Do you drink</span> juice? / <span className="text-blue-600 font-bold">soda</span> / <span className="text-blue-600 font-bold">tea</span> / <span className="text-blue-600 font-bold">coffee</span> / <span className="text-blue-600 font-bold">milk</span></p>
                  <p className="text-sm text-gray-500 mt-1">Você bebe suco? / refrigerante / chá / café / leite</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">3. <span className="text-blue-600 font-bold">Do you want</span> water? / <span className="text-blue-600 font-bold">soda</span> / <span className="text-blue-600 font-bold">rice</span> / <span className="text-blue-600 font-bold">beans</span> / <span className="text-blue-600 font-bold">sausage</span></p>
                  <p className="text-sm text-gray-500 mt-1">Você quer água? / refrigerante / arroz / feijão / salsicha</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">4. <span className="text-blue-600 font-bold">Do you like</span> salad? / <span className="text-blue-600 font-bold">fish</span> / <span className="text-blue-600 font-bold">chicken</span> / <span className="text-blue-600 font-bold">French fries</span> / <span className="text-blue-600 font-bold">meat</span></p>
                  <p className="text-sm text-gray-500 mt-1">Você gosta de salada? / peixe / frango / batatas fritas / carne</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">5. <span className="text-blue-600 font-bold">Do you eat</span> chicken? / <span className="text-blue-600 font-bold">fish</span> / <span className="text-blue-600 font-bold">meat</span> / <span className="text-blue-600 font-bold">vegetables</span> / <span className="text-blue-600 font-bold">sausage</span></p>
                  <p className="text-sm text-gray-500 mt-1">Você come frango? / peixe / carne / legumes / salsicha</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">6. <span className="text-blue-600 font-bold">Do you drink</span> soda? / <span className="text-blue-600 font-bold">juice</span> / <span className="text-blue-600 font-bold">milk</span> / <span className="text-blue-600 font-bold">water</span> / <span className="text-blue-600 font-bold">tea</span></p>
                  <p className="text-sm text-gray-500 mt-1">Você bebe refrigerante? / suco / leite / água / chá</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">7. <span className="text-blue-600 font-bold">Do you like</span> sandwiches? / <span className="text-blue-600 font-bold">tomatoes</span> / <span className="text-blue-600 font-bold">salad</span> / <span className="text-blue-600 font-bold">bacon</span> / <span className="text-blue-600 font-bold">beans</span></p>
                  <p className="text-sm text-gray-500 mt-1">Você gosta de sanduíches? / tomates / salada / bacon / feijão</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">8. <span className="text-blue-600 font-bold">Do you want</span> soda? / <span className="text-blue-600 font-bold">juice</span> / <span className="text-blue-600 font-bold">water</span> / <span className="text-blue-600 font-bold">meat</span> / <span className="text-blue-600 font-bold">eggs</span></p>
                  <p className="text-sm text-gray-500 mt-1">Você quer refrigerante? / suco / água / carne / ovos</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">9. <span className="text-blue-600 font-bold">Do you prefer</span> rice? / <span className="text-blue-600 font-bold">beans</span> / <span className="text-blue-600 font-bold">French fries</span> / <span className="text-blue-600 font-bold">salad</span> / <span className="text-blue-600 font-bold">bacon</span></p>
                  <p className="text-sm text-gray-500 mt-1">Você prefere arroz? / feijão / batatas fritas / salada / bacon</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">10. <span className="text-blue-600 font-bold">Do you prefer to eat</span> meat? / <span className="text-blue-600 font-bold">fish</span> / <span className="text-blue-600 font-bold">chicken</span> / <span className="text-blue-600 font-bold">sausage</span></p>
                  <p className="text-sm text-gray-500 mt-1">Você prefere comer carne? / peixe / frango / salsicha</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">11. <span className="text-blue-600 font-bold">Do you love</span> pizza? / <span className="text-blue-600 font-bold">chocolate</span> / <span className="text-blue-600 font-bold">ice cream</span></p>
                  <p className="text-sm text-gray-500 mt-1">Você adora pizza? / chocolate / sorvete</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">12. <span className="text-blue-600 font-bold">Do you prefer</span> coffee or tea? / <span className="text-blue-600 font-bold">juice or soda</span> / <span className="text-blue-600 font-bold">water or milk</span></p>
                  <p className="text-sm text-gray-500 mt-1">Você prefere café ou chá? / suco ou refrigerante / água ou leite</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">13. <span className="text-blue-600 font-bold">What do you prefer to eat</span> for dinner? / <span className="text-blue-600 font-bold">lunch</span> / <span className="text-blue-600 font-bold">breakfast</span></p>
                  <p className="text-sm text-gray-500 mt-1">O que você prefere comer no jantar? / almoço / café da manhã</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">14. <span className="text-blue-600 font-bold">What do you love to drink</span> in the morning? / <span className="text-blue-600 font-bold">afternoon</span> / <span className="text-blue-600 font-bold">evening</span></p>
                  <p className="text-sm text-gray-500 mt-1">O que você adora beber pela manhã? / tarde / noite</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Seção 5 - Real Life Practice */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8">
            <h2 className="text-2xl font-bold">MAKE IT YOURS!</h2>
            <p className="mt-2 text-blue-100 italic">
              Replace the words to practice pronunciation in real situations
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
                          1. I prefer to drink a glass of water.
                        </p>
                        <p className="text-sm text-gray-600">Eu prefiro beber um copo de água.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
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
                          2. I prefer to eat beef and vegetables.
                        </p>
                        <p className="text-sm text-gray-600">Eu prefiro comer carne bovina e legumes.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
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
                          3. I prefer juice to soda.
                        </p>
                        <p className="text-sm text-gray-600">Eu prefiro suco a refrigerante.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
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
                          4. I love French fries.
                        </p>
                        <p className="text-sm text-gray-600">Eu adoro batatas fritas.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
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
                          5. I prefer to eat chicken and salad for lunch.
                        </p>
                        <p className="text-sm text-gray-600">Eu prefiro comer frango e salada no almoço.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio('do you like sausages and bacon')} 
                        className="mr-3 mt-1 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828a1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          6. Do you like sausages and bacon?
                        </p>
                        <p className="text-sm text-gray-600">Você gosta de salsichas e bacon?</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio('do you want to drink juice')} 
                        className="mr-3 mt-1 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828a1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          7. Do you want to drink juice?
                        </p>
                        <p className="text-sm text-gray-600">Você quer beber suco?</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio('do you prefer to eat fish or beef for dinner')} 
                        className="mr-3 mt-1 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828a1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          8. Do you prefer to eat fish or beef for dinner?
                        </p>
                        <p className="text-sm text-gray-600">Você prefere comer peixe ou carne bovina no jantar?</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio('what do you like')} 
                        className="mr-3 mt-1 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828a1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          9. What do you like?
                        </p>
                        <p className="text-sm text-gray-600">O que você gosta?</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
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
                          10. What do you want to eat?
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
                        alt="Main meals"
                        className="rounded-xl object-cover w-full h-full"
                      />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">
                      Meats, fish and side dishes
                    </p>
                  </div>
                  
                  <div className="bg-white rounded-2xl p-4 shadow-md">
                    <div className="relative h-64 w-full">
                      <img
                        src={drinkAndSandwichImage}
                        alt="Drinks and sandwiches"
                        className="rounded-xl object-cover w-full h-full"
                      />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">
                      Drinks and varied sandwiches
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Seção 6 - Check It Out */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8">
            <h2 className="text-3xl font-bold">WRAP UP!</h2>
            <p className="mt-2 text-blue-100 italic">
              Practice essential structures to talk about food preferences completing the rest of the sentences.
            </p>
          </div>

          <div className="flex flex-col md:flex-row">
            {/* Coluna esquerda - Expressões */}
            <div className="bg-blue-900 text-white flex-1 p-6 space-y-4 text-xl">
              <p className="font-bold">I like to eat... <span className="text-sm text-blue-300 ml-2">Eu gosto de comer...</span></p>
              <p className="font-bold">I want to drink... <span className="text-sm text-blue-300 ml-2">Eu quero beber...</span></p>
              <p className="font-bold">I don't like to eat... <span className="text-sm text-blue-300 ml-2">Eu não gosto de comer...</span></p>
              <p className="font-bold">I don't want to drink... <span className="text-sm text-blue-300 ml-2">Eu não quero beber...</span></p>
            </div>

            {/* Coluna central - Imagem e balão */}
            <div className="bg-white flex-1 p-6 flex flex-col items-center justify-center text-xl">
              <img
                src={vegetablesImage}
                alt="Person choosing food"
                className="rounded-full w-40 h-40 object-cover mb-4"
              />
              <div className="bg-yellow-200 text-black px-4 py-2 rounded-xl shadow-md text-center">
                What do you want to eat? <span className="font-bold">I want chicken!</span>
                <p className="text-sm text-gray-600 mt-1">O que você quer comer? Eu quero frango!</p>
              </div>
            </div>

            {/* Coluna direita - Despedidas */}
            <div className="bg-blue-900 text-white flex-1 p-6 space-y-4 text-xl">
              <div className="flex items-center group">
                <button 
                  onClick={() => playAudio("bye see you")}
                  className="mr-2 text-blue-200 hover:text-white transition-colors"
                  aria-label="Play audio"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                </button>
                <p>• Bye! See you. <span className="text-sm text-blue-300 ml-2">Tchau! Até mais.</span></p>
              </div>
              <div className="flex items-center group">
                <button 
                  onClick={() => playAudio("see you later")}
                  className="mr-2 text-blue-200 hover:text-white transition-colors"
                  aria-label="Play audio"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                </button>
                <p>• See you later. <span className="text-sm text-blue-300 ml-2">Até mais tarde.</span></p>
              </div>
              <div className="flex items-center group">
                <button 
                  onClick={() => playAudio("good night")}
                  className="mr-2 text-blue-200 hover:text-white transition-colors"
                  aria-label="Play audio"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                </button>
                <p>• Good night! <span className="text-sm text-blue-300 ml-2">Boa noite!</span></p>
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
            &larr; Previous Lesson
          </button>
          <button
            onClick={() => router.push("/cursos/lesson6")}
            className="inline-block rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 text-lg transition-all duration-300 hover:from-purple-600 hover:to-purple-800 active:animate-glow"
          >
            Next Lesson &rarr;
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
              placeholder="Digite aqui sua anotação para a turma...&#10;Exemplo: Prestem atenção na pronúncia de 'prefer'!&#10;Ou: Revisem o vocabulário de alimentos para a próxima aula."
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