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
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '_')
      .replace(/[^\w\s]/g, '');
    
    const audio = new Audio(`/audios/fr/${formattedWord}.mp3`);
    audio.play().catch(e => console.error("Erreur lors de la lecture audio:", e));
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
            Leçon 3 - Nourriture & Boissons
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            Apprenez à exprimer vos préférences alimentaires en français. 🍎🍫
          </p>
          <div className="w-64 h-64 mx-auto">
            <Image
              src="/images/lesson3-bg.jpg"
              alt="Introduction de la leçon"
              width={256}
              height={256}
              className="w-full h-full object-cover rounded-2xl shadow-md"
            />
          </div>
        </div>

        {/* Seção 1 - Verbes avec Drill */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">
                <button 
                  onClick={() => playAudio("verbes")}
                  className="hover:text-blue-200 transition-colors cursor-pointer"
                >
                  🔹 VERBES
                </button>
              </h2>
              <p className="mt-2 text-blue-100 italic">
                Cliquez sur les verbes pour entendre la prononciation et pratiquer leurs formes
              </p>
            </div>
            <button 
              onClick={() => toggleDrill('verbs')}
              className="inline-block rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 text-sm transition-all duration-300 hover:from-purple-600 hover:to-purple-800 active:animate-glow"
            >
              {openDrills.verbs ? 'Cacher l\'exercice' : 'Montrer l\'exercice'}
            </button>
          </div>
          
          <div className="p-8">
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
              <li>
                <button 
                  onClick={() => playAudio("vouloir")} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  vouloir
                </button> = querer
              </li>
              <li>
                <button 
                  onClick={() => playAudio("aimer")} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  aimer
                </button> = gostar de
              </li>
              <li>
                <button 
                  onClick={() => playAudio("preferer")} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  préférer
                </button> = preferir
              </li>
            </ul>
            
            {openDrills.verbs && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    <button 
                      onClick={() => playAudio("je_veux_du_jus")}
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                    >
                      Je veux du jus.
                    </button> / J'aime / Je préfère
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Eu quero suco. / Eu gosto / Eu prefiro</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    <button 
                      onClick={() => playAudio("tu_aimes_le_chocolat")}
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                    >
                      Tu aimes le chocolat ?
                    </button> / Tu veux / Tu manges
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Você gosta de chocolate? / Você quer / Você come</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    <button 
                      onClick={() => playAudio("nous_voulons_des_toasts")}
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                    >
                      Nous voulons des toasts.
                    </button> / Nous aimons / Nous préférons
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Nós queremos torradas. / Nós gostamos / Nós preferimos</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    <button 
                      onClick={() => playAudio("ils_aiment_les_fruits")}
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                    >
                      Ils aiment les fruits.
                    </button> / Ils veulent / Ils mangent
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Eles gostam de frutas. / Eles querem / Eles comem</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    <button 
                      onClick={() => playAudio("elle_veut_du_yogourt")}
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                    >
                      Elle veut du yogourt.
                    </button> / Elle aime / Elle boit
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Ela quer iogurte. / Ela gosta / Ela bebe</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    <button 
                      onClick={() => playAudio("je_ne_veux_pas_d_oeufs")}
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                    >
                      Je ne veux pas d'œufs.
                    </button> / Je n'aime pas / Je ne préfère pas
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Eu não quero ovos. / Eu não gosto / Eu não prefiro</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    <button 
                      onClick={() => playAudio("tu_n_aimes_pas_la_confiture")}
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                    >
                      Tu n'aimes pas la confiture ?
                    </button> / Tu ne veux pas / Tu ne manges pas
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Você não gosta de geleia? / Você não quer / Você não come</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    <button 
                      onClick={() => playAudio("j_aime_manger_des_cereales")}
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                    >
                      J'aime manger des céréales.
                    </button> / Je veux / Je préfère des crackers
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Eu gosto de comer cereal. / Eu quero / Eu prefiro biscoitos salgados</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    <button 
                      onClick={() => playAudio("nous_voulons_boire_du_jus")}
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                    >
                      Nous voulons boire du jus.
                    </button> / Nous aimons / Nous buvons
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Nós queremos beber suco. / Nós gostamos / Nós bebemos</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    <button 
                      onClick={() => playAudio("tu_veux_une_part_de_tarte")}
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                    >
                      Tu veux une part de tarte ?
                    </button> / Tu aimes / Tu manges
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Você quer uma fatia de torta? / Você gosta / Você come</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Seção 2 - Vocabulaire avec Drill */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">
                <button 
                  onClick={() => playAudio("vocabulaire")}
                  className="hover:text-blue-200 transition-colors cursor-pointer"
                >
                  🔹 NOUVEAUX MOTS
                </button>
              </h2>
              <p className="mt-2 text-blue-100 italic">
                Cliquez sur chaque mot pour entendre sa prononciation correcte
              </p>
            </div>
            <button 
              onClick={() => toggleDrill('vocabulary')}
              className="inline-block rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 text-sm transition-all duration-300 hover:from-purple-600 hover:to-purple-800 active:animate-glow"
            >
              {openDrills.vocabulary ? 'Cacher l\'exercice' : 'Montrer l\'exercice'}
            </button>
          </div>
          
          <div className="p-8">
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <li>
                <button 
                  onClick={() => playAudio("pomme")} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  pomme
                </button> = maçã
              </li>
              <li>
                <button 
                  onClick={() => playAudio("orange")} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  orange
                </button> = laranja
              </li>
              <li>
                <button 
                  onClick={() => playAudio("fruit")} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  fruit
                </button> = fruta
              </li>
              <li>
                <button 
                  onClick={() => playAudio("toast")} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  toast
                </button> = torrada
              </li>
              <li>
                <button 
                  onClick={() => playAudio("confiture")} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  confiture
                </button> = geleia
              </li>
              <li>
                <button 
                  onClick={() => playAudio("cereales")} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  céréales
                </button> = cereal
              </li>
              <li>
                <button 
                  onClick={() => playAudio("yogourt")} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  yogourt
                </button> = iogurte
              </li>
              <li>
                <button 
                  onClick={() => playAudio("miel")} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  miel
                </button> = mel
              </li>
              <li>
                <button 
                  onClick={() => playAudio("granola")} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  granola
                </button> = granola
              </li>
              <li>
                <button 
                  onClick={() => playAudio("oeufs")} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  œufs
                </button> = ovos
              </li>
              <li>
                <button 
                  onClick={() => playAudio("tarte")} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  tarte
                </button> = torta
              </li>
              <li>
                <button 
                  onClick={() => playAudio("chocolat")} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  chocolat
                </button> = chocolate
              </li>
              <li>
                <button 
                  onClick={() => playAudio("jus")} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  jus
                </button> = suco
              </li>
              <li>
                <button 
                  onClick={() => playAudio("lait")} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  lait
                </button> = leite
              </li>
              <li>
                <button 
                  onClick={() => playAudio("fromage")} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  fromage
                </button> = queijo
              </li>
              <li>
                <button 
                  onClick={() => playAudio("pain")} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  pain
                </button> = pão
              </li>
            </ul>
            
            {openDrills.vocabulary && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    Je mange des <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio("toasts")}>toasts</span> avec de la confiture. / céréales / yogourt
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Eu como torradas com geleia. / cereal / iogurte</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    Tu veux du <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio("chocolat")}>chocolat</span> ? / de la tarte / de la confiture
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Você quer chocolate? / torta / geleia</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    Nous aimons les <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio("fruits")}>fruits</span>. / yogourt / granola
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Nós gostamos de frutas. / iogurte / granola</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    Je veux une part de <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio("tarte")}>tarte</span>. / gâteau / pain
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Eu quero uma fatia de torta. / bolo / pão</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    Tu aimes le <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio("yogourt")}>yogourt</span> avec du miel ? / granola / céréales
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Você gosta de iogurte com mel? / granola / cereal</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    Je ne veux pas d'<span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio("oeufs")}>œufs</span>. / toasts / céréales
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Eu não quero ovos. / torradas / cereal</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    Nous mangeons des <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio("cereales")}>céréales</span> au petit-déjeuner. / toasts / fruits
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Nós comemos cereal no café da manhã. / torradas / frutas</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    Elle veut du <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio("jus_d_orange")}>jus d'orange</span>. / pomme / raisin
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Ela quer suco de laranja. / maçã / uva</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    J'aime le <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio("miel")}>miel</span> dans mon yogourt. / confiture / granola
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Eu gosto de mel no iogurte. / geleia / granola</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    Tu veux de la <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio("granola")}>granola</span> avec du yogourt ? / miel / fruits
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Você quer granola com iogurte? / mel / frutas</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Seção 3 - Phrases Utiles avec Drill */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">
                <button 
                  onClick={() => playAudio("phrases_utiles")}
                  className="hover:text-blue-200 transition-colors cursor-pointer"
                >
                  🔹 PARLEZ COMME UN NATIF
                </button>
              </h2>
              <p className="mt-2 text-blue-100 italic">
                Pratiquez des phrases courantes pour exprimer vos préférences
              </p>
            </div>
            <button 
              onClick={() => toggleDrill('usefulPhrases')}
              className="inline-block rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 text-sm transition-all duration-300 hover:from-purple-600 hover:to-purple-800 active:animate-glow"
            >
              {openDrills.usefulPhrases ? 'Cacher l\'exercice' : 'Montrer l\'exercice'}
            </button>
          </div>
          
          <div className="p-8">
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
              <li>
                <button 
                  onClick={() => playAudio("je_mange_des_toasts_avec_de_la_confiture_au_petit_dejeuner")} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  Je mange des toasts avec de la confiture au petit-déjeuner.
                </button> = Eu como torradas com geleia no café da manhã.
              </li>
              <li>
                <button 
                  onClick={() => playAudio("je_veux_un_morceau_de_chocolat_sil_vous_plait")} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  Je veux un morceau de chocolat, s'il vous plaît.
                </button> = Eu quero um pedaço de chocolate, por favor.
              </li>
              <li>
                <button 
                  onClick={() => playAudio("je_veux_une_part_de_tarte")} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  Je veux une part de tarte.
                </button> = Eu quero uma fatia de torta.
              </li>
            </ul>
            
            {openDrills.usefulPhrases && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    Je mange des <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio("cereales")}>céréales</span> au petit-déjeuner. / toasts / yogourt
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Eu como cereal no café da manhã. / torradas / iogurte</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    Je veux un morceau de <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio("fromage")}>fromage</span>, s'il vous plaît. / chocolat / tarte
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Eu quero um pedaço de queijo, por favor. / chocolate / torta</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    Je veux une part de <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio("tarte_aux_pommes")}>tarte aux pommes</span>. / chocolat / orange
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Eu quero uma fatia de torta de maçã. / chocolate / laranja</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    Tu veux un morceau de <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio("chocolat")}>chocolat</span> ? / tarte / fromage
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Você quer um pedaço de chocolate? / torta / queijo</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    Nous mangeons des <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio("toasts")}>toasts</span> avec de la confiture. / miel / beurre
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Nós comemos torradas com geleia. / mel / manteiga</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    Je veux du <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio("jus_d_orange")}>jus d'orange</span> au petit-déjeuner. / lait / thé
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Eu quero suco de laranja no café da manhã. / leite / chá</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    Elle veut une part de <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio("tarte_au_chocolat")}>tarte au chocolat</span>. / pomme / fraise
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Ela quer uma fatia de torta de chocolate. / maçã / morango</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    Ils mangent du <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio("yogourt")}>yogourt</span> avec de la granola. / miel / fruits
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Eles comem iogurte com granola. / mel / frutas</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    Je veux des <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio("oeufs")}>œufs</span> au petit-déjeuner. / toasts / céréales
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Eu quero ovos no café da manhã. / torradas / cereal</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    Tu manges des <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio("fruits")}>fruits</span> au petit-déjeuner ? / toasts / céréales
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Você come frutas no café da manhã? / torradas / cereal</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Seção 4 - Grammaire avec Drill */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">
                <button 
                  onClick={() => playAudio("grammaire")}
                  className="hover:text-blue-200 transition-colors cursor-pointer"
                >
                  🔹 GRAMMAIRE
                </button>
              </h2>
              <p className="mt-2 text-blue-100 italic">
                Structures pour exprimer les goûts et les préférences
              </p>
            </div>
            <button 
              onClick={() => toggleDrill('grammar')}
              className="inline-block rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 text-sm transition-all duration-300 hover:from-purple-600 hover:to-purple-800 active:animate-glow"
            >
              {openDrills.grammar ? 'Cacher l\'exercice' : 'Montrer l\'exercice'}
            </button>
          </div>
          
          <div className="p-8">
            <div className="bg-blue-50 p-4 rounded-[20px] text-gray-800 space-y-3 mb-6">
              <p>
                <button 
                  onClick={() => playAudio("je_veux_de_la_banane_et_de_la_granola")} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  Je veux de la banane et de la granola.
                </button> = Eu quero banana e granola.
              </p>
              <p>
                <button 
                  onClick={() => playAudio("je_ne_veux_pas_de_tarte_au_chocolat")} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  Je ne veux pas de tarte au chocolat.
                </button> = Eu não quero torta de chocolate.
              </p>
              <p>
                <button 
                  onClick={() => playAudio("j_aime_les_pommes")} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  J'aime les pommes.
                </button> = Eu gosto de maçãs.
              </p>
              <p>
                <button 
                  onClick={() => playAudio("je_n_aime_pas_la_confiture")} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  Je n'aime pas la confiture.
                </button> = Eu não gosto de geleia.
              </p>
              <p>
                <button 
                  onClick={() => playAudio("j_aime_manger_des_cereales_avec_du_miel")} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  J'aime manger des céréales avec du miel.
                </button> = Eu gosto de comer cereal com mel.
              </p>
              <p>
                <button 
                  onClick={() => playAudio("je_veux_boire_du_jus_d_orange")} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  Je veux boire du jus d'orange.
                </button> = Eu quero beber suco de laranja.
              </p>
            </div>
            
            {openDrills.grammar && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    Je veux <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio("pomme_et_granola")}>pomme et granola</span>. / orange et miel / banane et yogourt
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Eu quero maçã e granola. / laranja e mel / banana e iogurte</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    Je ne veux pas de <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio("tarte_aux_pommes")}>tarte aux pommes</span>. / chocolat / orange
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Eu não quero torta de maçã. / chocolate / laranja</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    J'aime les <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio("oranges")}>oranges</span>. / pommes / fruits
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Eu gosto de laranjas. / maçãs / frutas</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    Je n'aime pas les <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio("cereales")}>céréales</span>. / œufs / toasts
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Eu não gosto de cereal. / ovos / torradas</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    J'aime manger des <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio("toasts_avec_du_miel")}>toasts avec du miel</span>. / confiture / fromage
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Eu gosto de comer torradas com mel. / geleia / queijo</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    Je veux boire du <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio("jus_de_pomme")}>jus de pomme</span>. / orange / raisin
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Eu quero beber suco de maçã. / laranja / uva</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    Tu aimes le <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio("yogourt")}>yogourt</span> ? / granola / miel
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Você gosta de iogurte? / granola / mel</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    Nous ne voulons pas d'<span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio("oeufs")}>œufs</span>. / toasts / céréales
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Nós não queremos ovos. / torradas / cereal</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    Ils aiment manger des <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio("fruits")}>fruits</span>. / tarte / chocolat
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Eles gostam de comer frutas. / torta / chocolate</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    Tu veux boire du <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio("lait")}>lait</span> ? / jus / thé
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Você quer beber leite? / suco / chá</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Seção 5 - Real Life Practice */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8">
            <h2 className="text-2xl font-bold">
              <button 
                onClick={() => playAudio("mise_en_pratique")}
                className="hover:text-blue-200 transition-colors cursor-pointer"
              >
                🔹 MISE EN PRATIQUE
              </button>
            </h2>
            <p className="mt-2 text-blue-100 italic">
              Remplacez les mots en bleu pour pratiquer la prononciation dans des situations réelles
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
                        onClick={() => playAudio("je_veux_du_yogourt_et_de_la_granola")} 
                        className="mr-3 mt-1 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          1. Je veux <span 
                            className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                            onClick={() => playAudio("yogourt")}
                          >du yogourt</span> et de la granola.
                        </p>
                        <p className="text-sm text-gray-600">Eu quero iogurte e granola.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio("je_ne_veux_pas_d_oeufs")} 
                        className="mr-3 mt-1 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          2. Je ne veux pas d'<span 
                            className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                            onClick={() => playAudio("oeufs")}
                          >œufs</span>.
                        </p>
                        <p className="text-sm text-gray-600">Eu não quero ovos.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio("j_aime_boire_du_jus")} 
                        className="mr-3 mt-1 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          3. J'aime boire du <span 
                            className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                            onClick={() => playAudio("jus")}
                          >jus</span>.
                        </p>
                        <p className="text-sm text-gray-600">Eu gosto de beber suco.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio("je_veux_boire_du_lait")} 
                        className="mr-3 mt-1 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          4. Je veux boire du <span 
                            className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                            onClick={() => playAudio("lait")}
                          >lait</span>.
                        </p>
                        <p className="text-sm text-gray-600">Eu quero beber leite.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio("je_veux_manger_du_miel")} 
                        className="mr-3 mt-1 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          5. Je veux manger du <span 
                            className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                            onClick={() => playAudio("miel")}
                          >miel</span>.
                        </p>
                        <p className="text-sm text-gray-600">Eu quero comer mel.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio("j_aime_les_oranges")} 
                        className="mr-3 mt-1 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          6. J'aime les <span 
                            className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                            onClick={() => playAudio("oranges")}
                          >oranges</span>.
                        </p>
                        <p className="text-sm text-gray-600">Eu gosto de laranjas.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio("je_n_aime_pas_le_jus_de_pomme")} 
                        className="mr-3 mt-1 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          7. Je n'aime pas le <span 
                            className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                            onClick={() => playAudio("jus_de_pomme")}
                          >jus de pomme</span>.
                        </p>
                        <p className="text-sm text-gray-600">Eu não gosto de suco de maçã.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio("j_aime_la_tarte_au_chocolat")} 
                        className="mr-3 mt-1 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          8. J'aime la <span 
                            className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                            onClick={() => playAudio("tarte_au_chocolat")}
                          >tarte au chocolat</span>.
                        </p>
                        <p className="text-sm text-gray-600">Eu gosto de torta de chocolate.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio("je_veux_un_morceau_de_fromage")} 
                        className="mr-3 mt-1 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          9. Je veux un morceau de <span 
                            className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                            onClick={() => playAudio("fromage")}
                          >fromage</span>.
                        </p>
                        <p className="text-sm text-gray-600">Eu quero um pedaço de queijo.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio("je_veux_manger_des_toasts_au_petit_dejeuner")} 
                        className="mr-3 mt-1 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          10. Je veux manger des <span 
                            className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                            onClick={() => playAudio("toasts")}
                          >toasts</span> au petit-déjeuner.
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
                        alt="Petit-déjeuner sain"
                        layout="fill"
                        objectFit="cover"
                        className="rounded-xl"
                      />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">
                      Petit-déjeuner avec fruits et yogourt
                    </p>
                  </div>
                  
                  <div className="bg-white rounded-2xl p-4 shadow-md h-full">
                    <div className="relative h-64 w-full">
                      <Image
                        src="/images/rl-image-2.jpg"
                        alt="Desserts et tartes"
                        layout="fill"
                        objectFit="cover"
                        className="rounded-xl"
                      />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">
                      Variété de desserts et tartes
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
              <h2 className="text-3xl font-bold">
                <button 
                  onClick={() => playAudio("recapitulatif")}
                  className="hover:text-blue-200 transition-colors cursor-pointer"
                >
                  🔹 RÉCAPITULATIF
                </button>
              </h2>
              <p className="mt-2 text-blue-100 italic">
                Pratiquez les structures essentielles pour parler de vos préférences
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row">
            {/* Coluna esquerda - Expressões */}
            <div className="bg-blue-900 text-white flex-1 p-6 space-y-4 text-xl">
              <p className="font-bold">
                <button 
                  onClick={() => playAudio("j_aime_manger")}
                  className="hover:text-blue-300 transition-colors cursor-pointer"
                >
                  J'aime manger...
                </button>
                <span className="text-sm text-blue-300 ml-2">Eu gosto de comer...</span>
              </p>
              <p className="font-bold">
                <button 
                  onClick={() => playAudio("je_veux_boire")}
                  className="hover:text-blue-300 transition-colors cursor-pointer"
                >
                  Je veux boire...
                </button>
                <span className="text-sm text-blue-300 ml-2">Eu quero beber...</span>
              </p>
              <p className="font-bold">
                <button 
                  onClick={() => playAudio("je_n_aime_pas_manger")}
                  className="hover:text-blue-300 transition-colors cursor-pointer"
                >
                  Je n'aime pas manger...
                </button>
                <span className="text-sm text-blue-300 ml-2">Eu não gosto de comer...</span>
              </p>
              <p className="font-bold">
                <button 
                  onClick={() => playAudio("je_ne_veux_pas_boire")}
                  className="hover:text-blue-300 transition-colors cursor-pointer"
                >
                  Je ne veux pas boire...
                </button>
                <span className="text-sm text-blue-300 ml-2">Eu não quero beber...</span>
              </p>
            </div>

            {/* Coluna central - Imagem e balão */}
            <div className="bg-white flex-1 p-6 flex flex-col items-center justify-center text-xl relative">
              <Image
                src="/images/cio-image-1.jpg"
                alt="Femme choisissant de la nourriture"
                width={160}
                height={160}
                className="rounded-full w-40 h-40 object-cover mb-4"
              />
              <div className="bg-yellow-200 text-black px-4 py-2 rounded-xl shadow-md text-center">
                <button 
                  onClick={() => playAudio("je_veux_de_la_tarte_au_chocolat_et_toi")}
                  className="hover:text-blue-600 transition-colors cursor-pointer font-bold"
                >
                  Je veux de la tarte au chocolat. <span className="font-bold">Et toi ?</span>
                </button>
                <p className="text-sm text-gray-600 mt-1">Eu quero torta de chocolate. E você?</p>
              </div>
            </div>

            {/* Coluna direita - Au revoir */}
            <div className="bg-blue-900 text-white flex-1 p-6 space-y-4 text-xl">
              <div className="flex items-center group">
                <button 
                  onClick={() => playAudio("au_revoir_a_bientot")}
                  className="mr-2 text-blue-200 hover:text-white transition-colors"
                  aria-label="Play audio"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                </button>
                <p>
                  <button 
                    onClick={() => playAudio("au_revoir")}
                    className="hover:text-blue-300 transition-colors cursor-pointer"
                  >
                    • Au revoir !
                  </button>
                  <span className="text-sm text-blue-300 ml-2">Tchau!</span>
                </p>
              </div>
              <div className="flex items-center group">
                <button 
                  onClick={() => playAudio("a_tout_a_l_heure")}
                  className="mr-2 text-blue-200 hover:text-white transition-colors"
                  aria-label="Play audio"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                </button>
                <p>
                  <button 
                    onClick={() => playAudio("a_tout_a_l_heure")}
                    className="hover:text-blue-300 transition-colors cursor-pointer"
                  >
                    • À tout à l'heure.
                  </button>
                  <span className="text-sm text-blue-300 ml-2">Até mais tarde.</span>
                </p>
              </div>
              <div className="flex items-center group">
                <button 
                  onClick={() => playAudio("bonne_nuit")}
                  className="mr-2 text-blue-200 hover:text-white transition-colors"
                  aria-label="Play audio"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                </button>
                <p>
                  <button 
                    onClick={() => playAudio("bonne_nuit")}
                    className="hover:text-blue-300 transition-colors cursor-pointer"
                  >
                    • Bonne nuit !
                  </button>
                  <span className="text-sm text-blue-300 ml-2">Boa noite!</span>
                </p>
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
            &larr; Leçon précédente
          </button>
          <button
            onClick={() => router.push("/cursos/lesson4")}
            className="inline-block rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 text-lg transition-all duration-300 hover:from-purple-600 hover:to-purple-800 active:animate-glow"
          >
            Leçon suivante &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}