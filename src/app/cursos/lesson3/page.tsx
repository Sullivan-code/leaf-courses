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

  const playAudio = (word: string) => {
    const formattedWord = word
      .toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/[^\w\s]/g, '');
    
    const audio = new Audio(`/audios/${formattedWord}.mp3`);
    audio.play().catch(e => console.error("Erro ao reproduzir áudio:", e));
  };

  return (
    <div
      className="min-h-screen rounded-2xl py-16 px-6 bg-fixed"
      style={{
        backgroundImage: `url("/images/lesson3-bg.jpg")`,
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
            Lesson 3 - Food & Drink
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            Learn to express preferences about food and drinks in English. 🍎🍫
          </p>
          <div className="w-64 h-64 mx-auto">
            <Image
              src="/images/lesson3-bg.jpg"
              alt="Lesson intro"
              width={256}
              height={256}
              className="w-full h-full object-cover rounded-2xl shadow-md"
            />
          </div>
        </div>

        {/* Seção 1 - Verbos com Drill */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">🔹 VERBS</h2>
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
                  onClick={() => playAudio('towant')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  to want
                </button> = querer
              </li>
              <li>
                <button 
                  onClick={() => playAudio('tolike')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  to like
                </button> = gostar de
              </li>
            </ul>
            
            {openDrills.verbs && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">I want juice. / I like / I prefer</p>
                  <p className="text-sm text-gray-500 mt-1">Eu quero suco. / Eu gosto / Eu prefiro</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">Do you like chocolate? / Do you want / Do you eat</p>
                  <p className="text-sm text-gray-500 mt-1">Você gosta de chocolate? / Você quer / Você come</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">We want toast. / We like / We prefer</p>
                  <p className="text-sm text-gray-500 mt-1">Nós queremos torradas. / Nós gostamos / Nós preferimos</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">They like fruit. / They want / They eat</p>
                  <p className="text-sm text-gray-500 mt-1">Eles gostam de frutas. / Eles querem / Eles comem</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">She wants yogurt. / She likes / She drinks</p>
                  <p className="text-sm text-gray-500 mt-1">Ela quer iogurte. / Ela gosta / Ela bebe</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">I don't want eggs. / I don't like / I don't prefer</p>
                  <p className="text-sm text-gray-500 mt-1">Eu não quero ovos. / Eu não gosto / Eu não prefiro</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">Don't you like jam? / Don't you want / Don't you eat</p>
                  <p className="text-sm text-gray-500 mt-1">Você não gosta de geleia? / Você não quer / Você não come</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">I like to eat cereal. / I want / I prefer crackers</p>
                  <p className="text-sm text-gray-500 mt-1">Eu gosto de comer cereal. / Eu quero / Eu prefiro biscoitos salgados</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">We want to drink juice. / We like / We drink</p>
                  <p className="text-sm text-gray-500 mt-1">Nós queremos beber suco. / Nós gostamos / Nós bebemos</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">Do you want a slice of pie? / Do you like / Do you eat</p>
                  <p className="text-sm text-gray-500 mt-1">Você quer uma fatia de torta? / Você gosta / Você come</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Seção 2 - Vocabulário com Drill */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">🔹 New Vocabulary</h2>
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
                <button 
                  onClick={() => playAudio('apple')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  apple
                </button> = maçã
              </li>
              <li>
                <button 
                  onClick={() => playAudio('orange')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  orange
                </button> = laranja
              </li>
              <li>
                <button 
                  onClick={() => playAudio('fruit')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  fruit
                </button> = fruta
              </li>
              <li>
                <button 
                  onClick={() => playAudio('toast')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  toast
                </button> = torrada
              </li>
              <li>
                <button 
                  onClick={() => playAudio('jam')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  jam
                </button> = geleia
              </li>
              <li>
                <button 
                  onClick={() => playAudio('cereal')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  cereal
                </button> = cereal
              </li>
              <li>
                <button 
                  onClick={() => playAudio('yogurt')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  yogurt
                </button> = iogurte
              </li>
              <li>
                <button 
                  onClick={() => playAudio('honey')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  honey
                </button> = mel
              </li>
              <li>
                <button 
                  onClick={() => playAudio('granola')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  granola
                </button> = granola
              </li>
              <li>
                <button 
                  onClick={() => playAudio('eggs')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  eggs
                </button> = ovos
              </li>
              <li>
                <button 
                  onClick={() => playAudio('pie')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  pie
                </button> = torta
              </li>
              <li>
                <button 
                  onClick={() => playAudio('chocolate')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  chocolate
                </button> = chocolate
              </li>
            </ul>
            
            {openDrills.vocabulary && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">I eat <span className="text-blue-600">toast</span> with jam. / cereal / yogurt</p>
                  <p className="text-sm text-gray-500 mt-1">Eu como torradas com geleia. / cereal / iogurte</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">Do you want <span className="text-blue-600">chocolate</span>? / pie / jam</p>
                  <p className="text-sm text-gray-500 mt-1">Você quer chocolate? / torta / geleia</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">We like <span className="text-blue-600">fruit</span>. / yogurt / granola</p>
                  <p className="text-sm text-gray-500 mt-1">Nós gostamos de frutas. / iogurte / granola</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">I want a slice of <span className="text-blue-600">pie</span>. / cake / bread</p>
                  <p className="text-sm text-gray-500 mt-1">Eu quero uma fatia de torta. / bolo / pão</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">Do you like <span className="text-blue-600">yogurt</span> with honey? / granola / cereal</p>
                  <p className="text-sm text-gray-500 mt-1">Você gosta de iogurte com mel? / granola / cereal</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">I don't want <span className="text-blue-600">eggs</span>. / toast / cereal</p>
                  <p className="text-sm text-gray-500 mt-1">Eu não quero ovos. / torradas / cereal</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">We eat <span className="text-blue-600">cereal</span> for breakfast. / toast / fruit</p>
                  <p className="text-sm text-gray-500 mt-1">Nós comemos cereal no café da manhã. / torradas / frutas</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">She wants orange <span className="text-blue-600">juice</span>. / apple / grape</p>
                  <p className="text-sm text-gray-500 mt-1">Ela quer suco de laranja. / maçã / uva</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">I like <span className="text-blue-600">honey</span> on my yogurt. / jam / granola</p>
                  <p className="text-sm text-gray-500 mt-1">Eu gosto de mel no iogurte. / geleia / granola</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">Do you want <span className="text-blue-600">granola</span> with yogurt? / honey / fruit</p>
                  <p className="text-sm text-gray-500 mt-1">Você quer granola com iogurte? / mel / frutas</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Seção 3 - Frases Úteis com Drill */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">🔹 Speak Like a Native</h2>
              <p className="mt-2 text-blue-100 italic">
                Practice common phrases to express preferences
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
                <button 
                  onClick={() => playAudio('i_eat_toast_and_jam_for_breakfast')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  I eat toast and jam for breakfast.
                </button> = Eu como torradas com geleia no café da manhã.
              </li>
              <li>
                <button 
                  onClick={() => playAudio('i_want_a_piece_of_chocolate_please')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  I want a piece of chocolate, please.
                </button> = Eu quero um pedaço de chocolate, por favor.
              </li>
              <li>
                <button 
                  onClick={() => playAudio('i_want_a_slice_of_pie')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  I want a slice of pie.
                </button> = Eu quero uma fatia de torta.
              </li>
            </ul>
            
            {openDrills.usefulPhrases && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">I eat <span className="text-blue-600">cereal</span> for breakfast. / toast / yogurt</p>
                  <p className="text-sm text-gray-500 mt-1">Eu como cereal no café da manhã. / torradas / iogurte</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">I want a piece of <span className="text-blue-600">cheese</span>, please. / chocolate / pie</p>
                  <p className="text-sm text-gray-500 mt-1">Eu quero um pedaço de queijo, por favor. / chocolate / torta</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">I want a slice of <span className="text-blue-600">apple pie</span>. / chocolate / orange</p>
                  <p className="text-sm text-gray-500 mt-1">Eu quero uma fatia de torta de maçã. / chocolate / laranja</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">Do you want a piece of <span className="text-blue-600">chocolate</span>? / pie / cheese</p>
                  <p className="text-sm text-gray-500 mt-1">Você quer um pedaço de chocolate? / torta / queijo</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">We eat <span className="text-blue-600">toast</span> with jam. / honey / butter</p>
                  <p className="text-sm text-gray-500 mt-1">Nós comemos torradas com geleia. / mel / manteiga</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">I want <span className="text-blue-600">orange juice</span> with breakfast. / milk / tea</p>
                  <p className="text-sm text-gray-500 mt-1">Eu quero suco de laranja no café da manhã. / leite / chá</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">She wants a slice of <span className="text-blue-600">chocolate pie</span>. / apple / strawberry</p>
                  <p className="text-sm text-gray-500 mt-1">Ela quer uma fatia de torta de chocolate. / maçã / morango</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">They eat <span className="text-blue-600">yogurt</span> with granola. / honey / fruit</p>
                  <p className="text-sm text-gray-500 mt-1">Eles comem iogurte com granola. / mel / frutas</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">I want <span className="text-blue-600">eggs</span> for breakfast. / toast / cereal</p>
                  <p className="text-sm text-gray-500 mt-1">Eu quero ovos no café da manhã. / torradas / cereal</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">Do you eat <span className="text-blue-600">fruit</span> for breakfast? / toast / cereal</p>
                  <p className="text-sm text-gray-500 mt-1">Você come frutas no café da manhã? / torradas / cereal</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Seção 4 - Gramática com Drill */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">🔹 GRAMMAR</h2>
              <p className="mt-2 text-blue-100 italic">
                Structures to express likes and preferences
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
                <button 
                  onClick={() => playAudio('i_want_banana_and_granola')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  I want banana and granola.
                </button> = Eu quero banana e granola.
              </p>
              <p>
                <button 
                  onClick={() => playAudio('i_dont_want_chocolate_pie')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  I don't want chocolate pie.
                </button> = Eu não quero torta de chocolate.
              </p>
              <p>
                <button 
                  onClick={() => playAudio('i_like_apples')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  I like apples.
                </button> = Eu gosto de maçãs.
              </p>
              <p>
                <button 
                  onClick={() => playAudio('i_dont_like_jam')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  I don't like jam.
                </button> = Eu não gosto de geleia.
              </p>
              <p>
                <button 
                  onClick={() => playAudio('i_like_to_eat_cereal_and_honey')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  I like to eat cereal and honey.
                </button> = Eu gosto de comer cereal com mel.
              </p>
              <p>
                <button 
                  onClick={() => playAudio('i_want_to_drink_orange_juice')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  I want to drink orange juice.
                </button> = Eu quero beber suco de laranja.
              </p>
            </div>
            
            {openDrills.grammar && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">I want <span className="text-blue-600">apple and granola</span>. / orange and honey / banana and yogurt</p>
                  <p className="text-sm text-gray-500 mt-1">Eu quero maçã e granola. / laranja e mel / banana e iogurte</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">I don't want <span className="text-blue-600">apple pie</span>. / chocolate / orange</p>
                  <p className="text-sm text-gray-500 mt-1">Eu não quero torta de maçã. / chocolate / laranja</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">I like <span className="text-blue-600">oranges</span>. / apples / fruit</p>
                  <p className="text-sm text-gray-500 mt-1">Eu gosto de laranjas. / maçãs / frutas</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">I don't like <span className="text-blue-600">cereal</span>. / eggs / toast</p>
                  <p className="text-sm text-gray-500 mt-1">Eu não gosto de cereal. / ovos / torradas</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">I like to eat <span className="text-blue-600">toast with honey</span>. / jam / cheese</p>
                  <p className="text-sm text-gray-500 mt-1">Eu gosto de comer torradas com mel. / geleia / queijo</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">I want to drink <span className="text-blue-600">apple juice</span>. / orange / grape</p>
                  <p className="text-sm text-gray-500 mt-1">Eu quero beber suco de maçã. / laranja / uva</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">Do you like <span className="text-blue-600">yogurt</span>? / granola / honey</p>
                  <p className="text-sm text-gray-500 mt-1">Você gosta de iogurte? / granola / mel</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">We don't want <span className="text-blue-600">eggs</span>. / toast / cereal</p>
                  <p className="text-sm text-gray-500 mt-1">Nós não queremos ovos. / torradas / cereal</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">They like to eat <span className="text-blue-600">fruit</span>. / pie / chocolate</p>
                  <p className="text-sm text-gray-500 mt-1">Eles gostam de comer frutas. / torta / chocolate</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">Do you want to drink <span className="text-blue-600">milk</span>? / juice / tea</p>
                  <p className="text-sm text-gray-500 mt-1">Você quer beber leite? / suco / chá</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Seção 5 - Real Life Practice */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8">
            <h2 className="text-2xl font-bold">🔹 Make It Yours</h2>
            <p className="mt-2 text-blue-100 italic">
              Replace the blue words to practice pronunciation in real situations
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
                        onClick={() => playAudio('i_want_yogurt_and_granola')} 
                        className="mr-3 mt-1 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          1. I want <span 
                            className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                            onClick={() => playAudio('yogurt')}
                          >yogurt</span> and granola.
                        </p>
                        <p className="text-sm text-gray-600">Eu quero iogurte e granola.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio('i_dont_want_eggs')} 
                        className="mr-3 mt-1 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          2. I don't want <span 
                            className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                            onClick={() => playAudio('eggs')}
                          >eggs</span>.
                        </p>
                        <p className="text-sm text-gray-600">Eu não quero ovos.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio('i_like_to_drink_juice')} 
                        className="mr-3 mt-1 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          3. I like to drink <span 
                            className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                            onClick={() => playAudio('juice')}
                          >juice</span>.
                        </p>
                        <p className="text-sm text-gray-600">Eu gosto de beber suco.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio('i_want_to_drink_milk')} 
                        className="mr-3 mt-1 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          4. I want to drink <span 
                            className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                            onClick={() => playAudio('milk')}
                          >milk</span>.
                        </p>
                        <p className="text-sm text-gray-600">Eu quero beber leite.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio('i_want_to_eat_honey')} 
                        className="mr-3 mt-1 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          5. I want to eat <span 
                            className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                            onClick={() => playAudio('honey')}
                          >honey</span>.
                        </p>
                        <p className="text-sm text-gray-600">Eu quero comer mel.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio('i_like_oranges')} 
                        className="mr-3 mt-1 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          6. I like <span 
                            className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                            onClick={() => playAudio('oranges')}
                          >oranges</span>.
                        </p>
                        <p className="text-sm text-gray-600">Eu gosto de laranjas.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio('i_dont_like_apple_juice')} 
                        className="mr-3 mt-1 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          7. I don't like <span 
                            className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                            onClick={() => playAudio('apple juice')}
                          >apple juice</span>.
                        </p>
                        <p className="text-sm text-gray-600">Eu não gosto de suco de maçã.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio('i_like_chocolate_pie')} 
                        className="mr-3 mt-1 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          8. I like <span 
                            className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                            onClick={() => playAudio('chocolate pie')}
                          >chocolate pie</span>.
                        </p>
                        <p className="text-sm text-gray-600">Eu gosto de torta de chocolate.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio('i_want_a_piece_of_cheese')} 
                        className="mr-3 mt-1 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          9. I want a piece of <span 
                            className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                            onClick={() => playAudio('cheese')}
                          >cheese</span>.
                        </p>
                        <p className="text-sm text-gray-600">Eu quero um pedaço de queijo.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio('i_want_to_eat_toast_for_breakfast')} 
                        className="mr-3 mt-1 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          10. I want to eat <span 
                            className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                            onClick={() => playAudio('toast')}
                          >toast</span> for breakfast.
                        </p>
                        <p className="text-sm text-gray-600">Eu quero comer torradas no café da manhã.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Container das imagens - 1/3 da largura em grandes */}
                <div className="lg:w-1/3 flex flex-col gap-4">
                  <div className="bg-white rounded-2xl p-4 shadow-md h-full">
                    <div className="relative h-64 w-full">
                      <Image
                        src="/images/rl-image-1.jpg"
                        alt="Healthy breakfast"
                        layout="fill"
                        objectFit="cover"
                        className="rounded-xl"
                      />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">
                      Café da manhã com frutas e iogurte
                    </p>
                  </div>
                  
                  <div className="bg-white rounded-2xl p-4 shadow-md h-full">
                    <div className="relative h-64 w-full">
                      <Image
                        src="/images/rl-image-2.jpg"
                        alt="Desserts and pies"
                        layout="fill"
                        objectFit="cover"
                        className="rounded-xl"
                      />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">
                      Variedade de sobremesas e tortas
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Seção 6 - Check It Out (estilo print) */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold">🔹 WRAP UP</h2>
              <p className="mt-2 text-blue-100 italic">
                Practice essential structures to talk about preferences and practice them with the content you've already learned.
              </p>
            </div>
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
            <div className="bg-white flex-1 p-6 flex flex-col items-center justify-center text-xl relative">
              <Image
                src="/images/cio-image-1.jpg"
                alt="Woman choosing food"
                width={160}
                height={160}
                className="rounded-full w-40 h-40 object-cover mb-4"
              />
              <div className="bg-yellow-200 text-black px-4 py-2 rounded-xl shadow-md text-center">
                I want chocolate pie. <span className="font-bold">And you?</span>
                <p className="text-sm text-gray-600 mt-1">Eu quero torta de chocolate. E você?</p>
              </div>
            </div>

            {/* Coluna direita - Despedidas */}
            <div className="bg-blue-900 text-white flex-1 p-6 space-y-4 text-xl">
              <div className="flex items-center group">
                <button 
                  onClick={() => playAudio("bye_see_you")}
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
                  onClick={() => playAudio("see_you_later")}
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
                  onClick={() => playAudio("good_night")}
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
            onClick={() => router.push("https://website-english-course.vercel.app/cursos/lesson2")}
            className="inline-block rounded-full bg-gradient-to-r from-gray-500 to-gray-600 text-white px-8 py-3 text-lg transition-all duration-300 hover:from-gray-600 hover:to-gray-800 active:animate-glow"
          >
            &larr; Previous Lesson
          </button>
          <button
            onClick={() => router.push("/cursos/lesson4")}
            className="inline-block rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 text-lg transition-all duration-300 hover:from-purple-600 hover:to-purple-800 active:animate-glow"
          >
            Next Lesson &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}