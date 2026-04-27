"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

// Definindo tipos para as seções
type SectionKey = 'verbs' | 'vocabulary' | 'usefulPhrases' | 'grammar' | 'realLife';

export default function Lesson49GoingShopping() {
  const router = useRouter();
  const [openDrills, setOpenDrills] = useState({
    verbs: false,
    vocabulary: false,
    usefulPhrases: false,
    grammar: false,
    realLife: false,
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
        backgroundImage: `url("/images/lesson49-bg.jpg")`,
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
            📘 LESSON 49 – GOING SHOPPING
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            🛍️ Aprenda a falar sobre roupas, tamanhos, como experimentar peças e use o <strong>Present Continuous</strong>, <strong>Present Perfect</strong> e <strong>Past Perfect</strong> em inglês!
          </p>
          <div className="w-64 h-64 mx-auto">
            <Image
              src="/images/lesson49-main.jpg"
              alt="Going Shopping"
              width={256}
              height={256}
              className="w-full h-full object-cover rounded-2xl shadow-md"
            />
          </div>
        </div>

        {/* Seção 1 - Verbos (to wear / to change) */}
        <div className="bg-white border-2 border-purple-400 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">🔵 VERBS</h2>
              <p className="mt-2 text-purple-100 italic">
                Clique nos verbos para ouvir a pronúncia e estude suas conjugações
              </p>
            </div>
            <button 
              onClick={() => toggleDrill('verbs')}
              className="text-sm bg-purple-700 hover:bg-purple-800 text-white px-4 py-1 rounded-full transition-colors"
            >
              {openDrills.verbs ? 'Ocultar Exercício' : 'Mostrar Exercício'}
            </button>
          </div>
          
          <div className="p-8">
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
              <li>
                <button 
                  onClick={() => playAudio('to_wear')} 
                  className="text-purple-600 font-bold cursor-pointer hover:text-purple-800 transition-colors"
                >
                  to wear
                </button> = vestir, usar
              </li>
              <li>
                <button 
                  onClick={() => playAudio('to_change')} 
                  className="text-purple-600 font-bold cursor-pointer hover:text-purple-800 transition-colors"
                >
                  to change
                </button> = trocar, mudar
              </li>
            </ul>
            
            {openDrills.verbs && (
              <div className="mt-4 bg-purple-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">I wear / You wear / He wears / We wear / They wear</p>
                  <p className="text-sm text-gray-500 mt-1">Eu visto / Você veste / Ele veste / Nós vestimos / Eles vestem</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">She doesn't wear jeans.</p>
                  <p className="text-sm text-gray-500 mt-1">Ela não veste calça jeans.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">Does he wear glasses?</p>
                  <p className="text-sm text-gray-500 mt-1">Ele usa óculos?</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">Do you wear a uniform?</p>
                  <p className="text-sm text-gray-500 mt-1">Você usa uniforme?</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">Do they wear suits to work?</p>
                  <p className="text-sm text-gray-500 mt-1">Eles usam terno para o trabalho?</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">What do you like to wear?</p>
                  <p className="text-sm text-gray-500 mt-1">O que você gosta de usar?</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">I change / You change / He changes / We change / They change</p>
                  <p className="text-sm text-gray-500 mt-1">Eu troco / Você troca / Ele troca / Nós trocamos / Eles trocam</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">I don't change my style.</p>
                  <p className="text-sm text-gray-500 mt-1">Eu não mudo meu estilo.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">She doesn't change clothes often.</p>
                  <p className="text-sm text-gray-500 mt-1">Ela não troca de roupa com frequência.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">Do you change your outfit?</p>
                  <p className="text-sm text-gray-500 mt-1">Você muda sua roupa?</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">Do they change the shoes?</p>
                  <p className="text-sm text-gray-500 mt-1">Eles trocam os sapatos?</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">Does he change his mind often?</p>
                  <p className="text-sm text-gray-500 mt-1">Ele muda de ideia com frequência?</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Seção 2 - Vocabulário (Roupas e Acessórios) */}
        <div className="bg-white border-2 border-purple-400 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">🟣 NEW WORDS</h2>
              <p className="mt-2 text-purple-100 italic">
                Clique em cada palavra para ouvir sua pronúncia
              </p>
            </div>
            <button 
              onClick={() => toggleDrill('vocabulary')}
              className="text-sm bg-purple-700 hover:bg-purple-800 text-white px-4 py-1 rounded-full transition-colors"
            >
              {openDrills.vocabulary ? 'Ocultar Exercício' : 'Mostrar Exercício'}
            </button>
          </div>
          
          <div className="p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-purple-50 rounded-xl p-3 text-center">
                <Image src="/images/shirt.jpg" alt="shirt" width={80} height={80} className="mx-auto rounded-lg object-cover" />
                <button onClick={() => playAudio('shirt')} className="text-purple-600 font-bold mt-2">shirt</button>
                <p className="text-sm text-gray-600">blusa, camisa</p>
              </div>
              <div className="bg-purple-50 rounded-xl p-3 text-center">
                <Image src="/images/t-shirt.jpg" alt="t-shirt" width={80} height={80} className="mx-auto rounded-lg object-cover" />
                <button onClick={() => playAudio('t_shirt')} className="text-purple-600 font-bold mt-2">t-shirt</button>
                <p className="text-sm text-gray-600">camiseta</p>
              </div>
              <div className="bg-purple-50 rounded-xl p-3 text-center">
                <Image src="/images/pants.jpg" alt="pants" width={80} height={80} className="mx-auto rounded-lg object-cover" />
                <button onClick={() => playAudio('pants')} className="text-purple-600 font-bold mt-2">pants</button>
                <p className="text-sm text-gray-600">calça</p>
              </div>
              <div className="bg-purple-50 rounded-xl p-3 text-center">
                <Image src="/images/jeans.jpg" alt="jeans" width={80} height={80} className="mx-auto rounded-lg object-cover" />
                <button onClick={() => playAudio('jeans')} className="text-purple-600 font-bold mt-2">jeans</button>
                <p className="text-sm text-gray-600">calça jeans</p>
              </div>
              <div className="bg-purple-50 rounded-xl p-3 text-center">
                <Image src="/images/dress.jpg" alt="dress" width={80} height={80} className="mx-auto rounded-lg object-cover" />
                <button onClick={() => playAudio('dress')} className="text-purple-600 font-bold mt-2">dress</button>
                <p className="text-sm text-gray-600">vestido</p>
              </div>
              <div className="bg-purple-50 rounded-xl p-3 text-center">
                <Image src="/images/skirt.jpg" alt="skirt" width={80} height={80} className="mx-auto rounded-lg object-cover" />
                <button onClick={() => playAudio('skirt')} className="text-purple-600 font-bold mt-2">skirt</button>
                <p className="text-sm text-gray-600">saia</p>
              </div>
              <div className="bg-purple-50 rounded-xl p-3 text-center">
                <Image src="/images/jacket.jpg" alt="jacket" width={80} height={80} className="mx-auto rounded-lg object-cover" />
                <button onClick={() => playAudio('jacket')} className="text-purple-600 font-bold mt-2">jacket</button>
                <p className="text-sm text-gray-600">jaqueta</p>
              </div>
              <div className="bg-purple-50 rounded-xl p-3 text-center">
                <Image src="/images/coat.jpg" alt="coat" width={80} height={80} className="mx-auto rounded-lg object-cover" />
                <button onClick={() => playAudio('coat')} className="text-purple-600 font-bold mt-2">coat</button>
                <p className="text-sm text-gray-600">casaco</p>
              </div>
              <div className="bg-purple-50 rounded-xl p-3 text-center">
                <Image src="/images/sneakers.jpg" alt="sneakers" width={80} height={80} className="mx-auto rounded-lg object-cover" />
                <button onClick={() => playAudio('sneakers')} className="text-purple-600 font-bold mt-2">sneakers</button>
                <p className="text-sm text-gray-600">tênis</p>
              </div>
              <div className="bg-purple-50 rounded-xl p-3 text-center">
                <Image src="/images/suit.jpg" alt="suit" width={80} height={80} className="mx-auto rounded-lg object-cover" />
                <button onClick={() => playAudio('suit')} className="text-purple-600 font-bold mt-2">suit</button>
                <p className="text-sm text-gray-600">terno</p>
              </div>
              <div className="bg-purple-50 rounded-xl p-3 text-center">
                <Image src="/images/socks.jpg" alt="socks" width={80} height={80} className="mx-auto rounded-lg object-cover" />
                <button onClick={() => playAudio('socks')} className="text-purple-600 font-bold mt-2">socks</button>
                <p className="text-sm text-gray-600">meias</p>
              </div>
              <div className="bg-purple-50 rounded-xl p-3 text-center">
                <Image src="/images/shorts.jpg" alt="shorts" width={80} height={80} className="mx-auto rounded-lg object-cover" />
                <button onClick={() => playAudio('shorts')} className="text-purple-600 font-bold mt-2">shorts</button>
                <p className="text-sm text-gray-600">bermudas</p>
              </div>
              <div className="bg-purple-50 rounded-xl p-3 text-center">
                <Image src="/images/watch.jpg" alt="watch" width={80} height={80} className="mx-auto rounded-lg object-cover" />
                <button onClick={() => playAudio('watch')} className="text-purple-600 font-bold mt-2">watch</button>
                <p className="text-sm text-gray-600">relógio</p>
              </div>
              <div className="bg-purple-50 rounded-xl p-3 text-center">
                <Image src="/images/glasses.jpg" alt="glasses" width={80} height={80} className="mx-auto rounded-lg object-cover" />
                <button onClick={() => playAudio('glasses')} className="text-purple-600 font-bold mt-2">glasses</button>
                <p className="text-sm text-gray-600">óculos</p>
              </div>
              <div className="bg-purple-50 rounded-xl p-3 text-center">
                <Image src="/images/outfit.jpg" alt="outfit" width={80} height={80} className="mx-auto rounded-lg object-cover" />
                <button onClick={() => playAudio('outfit')} className="text-purple-600 font-bold mt-2">outfit</button>
                <p className="text-sm text-gray-600">roupa, conjunto</p>
              </div>
              <div className="bg-purple-50 rounded-xl p-3 text-center">
                <Image src="/images/style.jpg" alt="style" width={80} height={80} className="mx-auto rounded-lg object-cover" />
                <button onClick={() => playAudio('style')} className="text-purple-600 font-bold mt-2">style</button>
                <p className="text-sm text-gray-600">estilo</p>
              </div>
            </div>

            <div className="bg-purple-100 rounded-2xl p-6 mb-6">
              <h3 className="text-lg font-bold text-purple-800 mb-3">📝 Examples:</h3>
              <div className="grid md:grid-cols-2 gap-3">
                <p>👕 I prefer to wear <span className="text-purple-600 font-bold">a t-shirt</span></p>
                <p>👗 She likes to wear <span className="text-purple-600 font-bold">dresses</span></p>
                <p>👖 I need to buy <span className="text-purple-600 font-bold">new jeans</span></p>
                <p>🧥 He never wears <span className="text-purple-600 font-bold">this coat</span></p>
                <p>👟 I need to take my <span className="text-purple-600 font-bold">white sneakers</span></p>
                <p>👔 I want to buy <span className="text-purple-600 font-bold">a new suit</span></p>
                <p>🕶️ I want to buy <span className="text-purple-600 font-bold">something special</span></p>
                <p>👖 Those <span className="text-purple-600 font-bold">pants are beautiful</span></p>
              </div>
            </div>
            
            {openDrills.vocabulary && (
              <div className="mt-4 bg-purple-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">I prefer to wear <span className="text-purple-600 font-bold">a t-shirt</span>. / a suit / a shirt</p>
                  <p className="text-sm text-gray-500 mt-1">Eu prefiro usar uma camiseta. / um terno / uma camisa</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">She likes to wear <span className="text-purple-600 font-bold">skirts</span>. / dresses / sneakers</p>
                  <p className="text-sm text-gray-500 mt-1">Ela gosta de usar saias. / vestidos / tênis</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">My sister doesn't like to wear <span className="text-purple-600 font-bold">glasses</span>. / coats / jeans</p>
                  <p className="text-sm text-gray-500 mt-1">Minha irmã não gosta de usar óculos. / casacos / calças jeans</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">He never wears <span className="text-purple-600 font-bold">this jacket</span>. / coat / suit</p>
                  <p className="text-sm text-gray-500 mt-1">Ele nunca usa esta jaqueta. / casaco / terno</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">I need to take my <span className="text-purple-600 font-bold">white sneakers</span>. / blue dress / black jacket</p>
                  <p className="text-sm text-gray-500 mt-1">Eu preciso levar meus tênis brancos. / vestido azul / jaqueta preta</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">I want to change <span className="text-purple-600 font-bold">my outfit</span>. / my style / my shorts</p>
                  <p className="text-sm text-gray-500 mt-1">Eu quero trocar de roupa. / de estilo / de bermuda</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">Do you want to buy <span className="text-purple-600 font-bold">a new watch</span>? / a new outfit / a new suit</p>
                  <p className="text-sm text-gray-500 mt-1">Você quer comprar um relógio novo? / um conjunto novo / um terno novo</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">I want to buy <span className="text-purple-600 font-bold">something special</span>. / new / beautiful</p>
                  <p className="text-sm text-gray-500 mt-1">Eu quero comprar alguma coisa especial. / nova / bonita</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">I want <span className="text-purple-600 font-bold">that black t-shirt</span>. / jacket / suit</p>
                  <p className="text-sm text-gray-500 mt-1">Eu quero aquela camiseta preta. / jaqueta / terno</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">Those <span className="text-purple-600 font-bold">pants are beautiful</span>. / jeans / shorts</p>
                  <p className="text-sm text-gray-500 mt-1">Aquelas calças são lindas. / calças jeans / bermudas</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">I want to wear <span className="text-purple-600 font-bold">a suit for the meeting</span>. / a jacket / a shirt</p>
                  <p className="text-sm text-gray-500 mt-1">Eu quero usar um terno para a reunião. / uma jaqueta / uma camisa</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">What do you wear <span className="text-purple-600 font-bold">for work</span>? / for school</p>
                  <p className="text-sm text-gray-500 mt-1">O que você veste para o trabalho? / para a escola</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Seção 3 - Frases Úteis */}
        <div className="bg-white border-2 border-purple-400 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">🟢 USEFUL PHRASES</h2>
              <p className="mt-2 text-purple-100 italic">
                Pratique frases comuns para fazer compras
              </p>
            </div>
            <button 
              onClick={() => toggleDrill('usefulPhrases')}
              className="text-sm bg-purple-700 hover:bg-purple-800 text-white px-4 py-1 rounded-full transition-colors"
            >
              {openDrills.usefulPhrases ? 'Ocultar Exercício' : 'Mostrar Exercício'}
            </button>
          </div>
          
          <div className="p-8">
            <div className="bg-purple-50 p-4 rounded-[20px] text-gray-800 space-y-3 mb-6">
              <p>
                <button onClick={() => playAudio('i_want_to_buy_a_pair_of_shoes')} className="text-purple-600 font-bold cursor-pointer hover:text-purple-800">
                  I want to buy a pair of shoes.
                </button>
                <br />
                <span className="text-sm text-gray-500">Eu quero comprar um par de sapatos.</span>
              </p>
              <p>
                <button onClick={() => playAudio('i_want_to_try_that_dress_on')} className="text-purple-600 font-bold cursor-pointer hover:text-purple-800">
                  I want to try that dress on.
                </button>
                <br />
                <span className="text-sm text-gray-500">Eu quero experimentar aquele vestido.</span>
              </p>
              <p>
                <button onClick={() => playAudio('what_size_are_you')} className="text-purple-600 font-bold cursor-pointer hover:text-purple-800">
                  What size are you?
                </button>
                <br />
                <span className="text-sm text-gray-500">Qual é o seu tamanho?</span>
              </p>
            </div>
            
            {openDrills.usefulPhrases && (
              <div className="mt-4 bg-purple-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">What size <span className="text-purple-600 font-bold">do you wear</span>? / does he wear? / does she wear?</p>
                  <p className="text-sm text-gray-500 mt-1">Que tamanho você usa? / ele usa? / ela usa?</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">Does he wear <span className="text-purple-600 font-bold">size small</span>? / medium / large</p>
                  <p className="text-sm text-gray-500 mt-1">Ele usa tamanho pequeno? / médio / grande</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">I want to try <span className="text-purple-600 font-bold">that coat on</span>. / suit / pants</p>
                  <p className="text-sm text-gray-500 mt-1">Eu quero provar aquele casaco. / conjunto / calça</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">Do you want to try <span className="text-purple-600 font-bold">the dress on</span>? / the t-shirt / the shorts</p>
                  <p className="text-sm text-gray-500 mt-1">Você quer provar o vestido? / a camiseta / a bermuda</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">I want to buy <span className="text-purple-600 font-bold">a pair of shoes</span>. / a pair of jeans / a pair of black pants</p>
                  <p className="text-sm text-gray-500 mt-1">Eu quero comprar um par de sapatos. / um par de calças jeans / um par de calças pretas</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">He needs <span className="text-purple-600 font-bold">a pair of socks</span>. / a pair of glasses / a pair of sunglasses</p>
                  <p className="text-sm text-gray-500 mt-1">Ele precisa de um par de meias. / de óculos / de óculos de sol</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Seção 4 - Gramática (Present Continuous) */}
        <div className="bg-white border-2 border-purple-400 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">🟡 GRAMMAR - PRESENT CONTINUOUS</h2>
              <p className="mt-2 text-purple-100 italic">
                Aprenda a usar o Present Continuous para ações que estão acontecendo agora
              </p>
            </div>
            <button 
              onClick={() => toggleDrill('grammar')}
              className="text-sm bg-purple-700 hover:bg-purple-800 text-white px-4 py-1 rounded-full transition-colors"
            >
              {openDrills.grammar ? 'Ocultar Exercício' : 'Mostrar Exercício'}
            </button>
          </div>
          
          <div className="p-8">
            {/* Explicação em Português */}
            <div className="bg-purple-100 rounded-2xl p-6 mb-6">
              <h3 className="text-xl font-bold text-purple-800 mb-4 text-center">📚 ENTENDENDO O PRESENT CONTINUOUS</h3>
              
              <div className="bg-white rounded-xl p-4 border-l-4 border-green-500 mb-4">
                <h4 className="text-lg font-bold text-green-700 mb-2">✅ ESTRUTURA</h4>
                <p className="text-gray-700 mb-2"><span className="font-bold">Sujeito + verbo to be (am/is/are) + verbo principal com -ing</span></p>
                <p className="text-gray-600 italic">"I am waiting for the doctor."</p>
                <p className="text-sm text-gray-500">Eu estou esperando pelo médico.</p>
                <p className="text-gray-600 italic mt-2">"She is changing her outfit."</p>
                <p className="text-sm text-gray-500">Ela está trocando de roupa.</p>
              </div>

              <div className="bg-yellow-50 rounded-xl p-4 border-l-4 border-yellow-500">
                <h4 className="text-lg font-bold text-yellow-700 mb-2">💡 QUANDO USAR</h4>
                <p className="text-gray-700">Ações que estão acontecendo <span className="font-bold">agora, neste momento</span>.</p>
              </div>
            </div>

            <div className="bg-purple-50 p-4 rounded-[20px] text-gray-800 space-y-3 mb-6">
              <p>
                <button onClick={() => playAudio('i_am_waiting_for_the_doctor')} className="text-purple-600 font-bold cursor-pointer hover:text-purple-800">
                  I am waiting for the doctor.
                </button>
                <br />
                <span className="text-sm text-gray-500">Eu estou esperando pelo médico.</span>
              </p>
              <p>
                <button onClick={() => playAudio('you_are_wearing_a_beautiful_coat')} className="text-purple-600 font-bold cursor-pointer hover:text-purple-800">
                  You are wearing a beautiful coat.
                </button>
                <br />
                <span className="text-sm text-gray-500">Você está usando um casaco lindo.</span>
              </p>
              <p>
                <button onClick={() => playAudio('she_is_changing_her_outfit')} className="text-purple-600 font-bold cursor-pointer hover:text-purple-800">
                  She is changing her outfit.
                </button>
                <br />
                <span className="text-sm text-gray-500">Ela está trocando de roupa.</span>
              </p>
              <p>
                <button onClick={() => playAudio('he_is_making_a_delicious_cake')} className="text-purple-600 font-bold cursor-pointer hover:text-purple-800">
                  He is making a delicious cake.
                </button>
                <br />
                <span className="text-sm text-gray-500">Ele está fazendo um bolo delicioso.</span>
              </p>
              <p>
                <button onClick={() => playAudio('the_class_is_starting_now')} className="text-purple-600 font-bold cursor-pointer hover:text-purple-800">
                  The class is starting now.
                </button>
                <br />
                <span className="text-sm text-gray-500">A aula está começando agora.</span>
              </p>
              <p>
                <button onClick={() => playAudio('they_are_watching_a_movie_now')} className="text-purple-600 font-bold cursor-pointer hover:text-purple-800">
                  They are watching a movie now.
                </button>
                <br />
                <span className="text-sm text-gray-500">Eles estão assistindo a um filme agora.</span>
              </p>
              <p>
                <button onClick={() => playAudio('we_are_reading_a_funny_story')} className="text-purple-600 font-bold cursor-pointer hover:text-purple-800">
                  We are reading a funny story.
                </button>
                <br />
                <span className="text-sm text-gray-500">Nós estamos lendo uma história engraçada.</span>
              </p>
              <p>
                <button onClick={() => playAudio('the_children_are_studying_in_the_living_room')} className="text-purple-600 font-bold cursor-pointer hover:text-purple-800">
                  The children are studying in the living room.
                </button>
                <br />
                <span className="text-sm text-gray-500">As crianças estão estudando na sala de estar.</span>
              </p>
            </div>
            
            {openDrills.grammar && (
              <div className="mt-4 bg-purple-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">She is making <span className="text-purple-600 font-bold">my favorite dish</span>. / his / our</p>
                  <p className="text-sm text-gray-500 mt-1">Ela está fazendo meu prato favorito. / seu / nosso</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-purple-600 font-bold">He is opening</span> the store. / She is opening / We are opening</p>
                  <p className="text-sm text-gray-500 mt-1">Ele está abrindo a loja. / Ela está abrindo / Nós estamos abrindo</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">They are waiting for <span className="text-purple-600 font-bold">you</span>. / the sales clerk / the manager</p>
                  <p className="text-sm text-gray-500 mt-1">Eles estão esperando por você. / pelo vendedor / pelo gerente</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">He is closing <span className="text-purple-600 font-bold">the bar now</span>. / the snack bar / the restaurant</p>
                  <p className="text-sm text-gray-500 mt-1">Ele está fechando o bar agora. / a lanchonete / o restaurante</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">Someone is calling <span className="text-purple-600 font-bold">you</span>. / the doctor / the nurse</p>
                  <p className="text-sm text-gray-500 mt-1">Alguém está chamando você. / o médico / a enfermeira</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">She is wearing <span className="text-purple-600 font-bold">a dress</span>. / a coat / a pair of jeans</p>
                  <p className="text-sm text-gray-500 mt-1">Ela está usando um vestido. / um casaco / um par de calças jeans</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">He is talking to <span className="text-purple-600 font-bold">his sister</span>. / mother / father</p>
                  <p className="text-sm text-gray-500 mt-1">Ele está falando com a irmã dele. / mãe / pai</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">I am trying on <span className="text-purple-600 font-bold">the shoes</span>. / the suit / the shirt</p>
                  <p className="text-sm text-gray-500 mt-1">Eu estou provando os sapatos. / o terno / a camisa</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-purple-600 font-bold">I am changing</span> my clothes. / He is changing / She is changing</p>
                  <p className="text-sm text-gray-500 mt-1">Eu estou trocando de roupa. / Ele está trocando / Ela está trocando</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">We are having <span className="text-purple-600 font-bold">lunch</span>. / dinner / a snack</p>
                  <p className="text-sm text-gray-500 mt-1">Nós estamos almoçando. / jantando / fazendo um lanche</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Seção 5 - Real Life Practice */}
        <div className="bg-white border-2 border-purple-400 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">🟠 REAL LIFE</h2>
              <p className="mt-2 text-purple-100 italic">
                Pratique com situações do dia a dia em lojas e compras
              </p>
            </div>
            <button 
              onClick={() => toggleDrill('realLife')}
              className="text-sm bg-purple-700 hover:bg-purple-800 text-white px-4 py-1 rounded-full transition-colors"
            >
              {openDrills.realLife ? 'Ocultar Prática' : 'Mostrar Prática'}
            </button>
          </div>
          
          <div className="p-8">
            <div className="bg-purple-50 rounded-[20px] p-6">
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:w-2/3 space-y-4">
                  <div>
                    <div className="flex items-start">
                      <button onClick={() => playAudio('i_want_to_try_this_shirt_on')} className="mr-3 mt-1 text-purple-600 hover:text-purple-800">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">I want to try <span className="text-purple-600 font-bold">this shirt on</span>.</p>
                        <p className="text-sm text-gray-600">Quero experimentar esta camisa.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-start">
                      <button onClick={() => playAudio('do_you_want_to_try_the_blue_pants_on')} className="mr-3 mt-1 text-purple-600 hover:text-purple-800">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">Do you want to try <span className="text-purple-600 font-bold">the blue pants on</span>?</p>
                        <p className="text-sm text-gray-600">Você quer experimentar a calça azul?</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-start">
                      <button onClick={() => playAudio('i_need_to_change_my_clothes_before_we_go')} className="mr-3 mt-1 text-purple-600 hover:text-purple-800">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">I need to change my clothes <span className="text-purple-600 font-bold">before we go</span>.</p>
                        <p className="text-sm text-gray-600">Preciso trocar de roupa antes de irmos.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-start">
                      <button onClick={() => playAudio('i_prefer_to_wear_comfortable_clothes_to_work')} className="mr-3 mt-1 text-purple-600 hover:text-purple-800">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">I prefer to wear <span className="text-purple-600 font-bold">comfortable clothes</span> to work.</p>
                        <p className="text-sm text-gray-600">Prefiro usar roupas confortáveis para o trabalho.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-start">
                      <button onClick={() => playAudio('he_is_always_wearing_sunglasses')} className="mr-3 mt-1 text-purple-600 hover:text-purple-800">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">He is <span className="text-purple-600 font-bold">always wearing</span> sunglasses.</p>
                        <p className="text-sm text-gray-600">Ele está sempre usando óculos de sol.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-start">
                      <button onClick={() => playAudio('i_really_like_the_suit_youre_wearing_today')} className="mr-3 mt-1 text-purple-600 hover:text-purple-800">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">I really like the suit <span className="text-purple-600 font-bold">you're wearing today</span>.</p>
                        <p className="text-sm text-gray-600">Eu gosto muito do terno que você está usando hoje.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-start">
                      <button onClick={() => playAudio('youre_wearing_funny_socks')} className="mr-3 mt-1 text-purple-600 hover:text-purple-800">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">You're wearing <span className="text-purple-600 font-bold">funny socks</span>!</p>
                        <p className="text-sm text-gray-600">Você está usando meias engraçadas!</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-start">
                      <button onClick={() => playAudio('im_buying_a_new_pair_of_pants_for_my_husband')} className="mr-3 mt-1 text-purple-600 hover:text-purple-800">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">I'm buying a new pair of pants <span className="text-purple-600 font-bold">for my husband</span>.</p>
                        <p className="text-sm text-gray-600">Estou comprando uma calça nova para meu marido.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-start">
                      <button onClick={() => playAudio('theyre_waiting_for_you_at_the_mall')} className="mr-3 mt-1 text-purple-600 hover:text-purple-800">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">They're waiting for you <span className="text-purple-600 font-bold">at the mall</span>.</p>
                        <p className="text-sm text-gray-600">Eles estão esperando por você no shopping.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-start">
                      <button onClick={() => playAudio('were_changing_our_outfit_to_go_to_the_bar')} className="mr-3 mt-1 text-purple-600 hover:text-purple-800">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">We're changing our outfit <span className="text-purple-600 font-bold">to go to the bar</span>.</p>
                        <p className="text-sm text-gray-600">Estamos trocando de roupa para ir ao bar.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-start">
                      <button onClick={() => playAudio('she_is_talking_to_the_sales_clerk_now')} className="mr-3 mt-1 text-purple-600 hover:text-purple-800">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">She is talking to <span className="text-purple-600 font-bold">the sales clerk now</span>.</p>
                        <p className="text-sm text-gray-600">Ela está falando com o vendedor agora.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-start">
                      <button onClick={() => playAudio('theyre_closing_the_store_now')} className="mr-3 mt-1 text-purple-600 hover:text-purple-800">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">They're closing <span className="text-purple-600 font-bold">the store now</span>.</p>
                        <p className="text-sm text-gray-600">Eles estão fechando a loja agora.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lg:w-1/3 flex flex-col gap-4">
                  <div className="bg-white rounded-2xl p-4 shadow-md">
                    <div className="relative h-48 w-full">
                      <Image
                        src="/images/shopping-mall.jpg"
                        alt="Shopping mall"
                        width={200}
                        height={200}
                        className="w-full h-full object-cover rounded-xl"
                      />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">Shopping mall</p>
                  </div>
                  
                  <div className="bg-white rounded-2xl p-4 shadow-md">
                    <div className="relative h-48 w-full">
                      <Image
                        src="/images/clothing-store.jpg"
                        alt="Clothing store"
                        width={200}
                        height={200}
                        className="w-full h-full object-cover rounded-xl"
                      />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">Clothing store</p>
                  </div>

                  <div className="bg-white rounded-2xl p-4 shadow-md">
                    <div className="relative h-48 w-full">
                      <Image
                        src="/images/fitting-room.jpg"
                        alt="Fitting room"
                        width={200}
                        height={200}
                        className="w-full h-full object-cover rounded-xl"
                      />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">Fitting room</p>
                  </div>
                </div>
              </div>

              {/* Prática extra do REAL LIFE que aparece quando clica em Mostrar Prática */}
              {openDrills.realLife && (
                <div className="mt-6 bg-white rounded-2xl p-6 space-y-4 border-2 border-purple-200 animate-fadeIn">
                  <h3 className="text-xl font-bold text-purple-700 mb-4">📝 More Practice:</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-3 bg-purple-50 rounded-xl">
                      <p className="font-medium">What do you want to <span className="text-purple-600 font-bold">change</span>? / does he want / does she want</p>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-xl">
                      <p className="font-medium">I want to change <span className="text-purple-600 font-bold">my clothes</span>. / my outfit / my shoes</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Seção 6 - Check It Out! */}
        <div className="bg-white border-2 border-purple-400 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-purple-600 text-white py-4 px-8">
            <h2 className="text-3xl font-bold">🧩 CHECK IT OUT!</h2>
            <p className="mt-2 text-purple-100 italic">
              Revise os pontos principais, tamanhos, cores, Present Perfect e Past Perfect
            </p>
          </div>

          <div className="flex flex-col md:flex-row">
            <div className="bg-purple-900 text-white flex-1 p-6 space-y-3 text-lg">
              <h3 className="text-xl font-bold text-purple-300 mb-3">📏 Sizes:</h3>
              <div className="flex items-center gap-2">
                <span className="text-purple-300 text-2xl">•</span>
                <p><span className="font-bold text-purple-300">small</span> / medium / large</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-purple-300 text-2xl">•</span>
                <p>I'm a <span className="font-bold text-purple-300">medium</span>. / I wear medium.</p>
              </div>
              
              <h3 className="text-xl font-bold text-purple-300 mb-3 mt-6">👕 Clothes:</h3>
              <div className="flex items-center gap-2">
                <span className="text-purple-300 text-2xl">•</span>
                <p><span className="font-bold text-purple-300">a pair of</span> shoes / sneakers / shorts / pants / jeans</p>
              </div>
              
              <h3 className="text-xl font-bold text-purple-300 mb-3 mt-6">❓ Questions:</h3>
              <div className="flex items-center gap-2">
                <span className="text-purple-300 text-2xl">•</span>
                <p>How much <span className="font-bold text-purple-300">is this skirt</span>? → It's US$30.</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-purple-300 text-2xl">•</span>
                <p>How much <span className="font-bold text-purple-300">are these sunglasses</span>? → They're US$100.</p>
              </div>
              
              <h3 className="text-xl font-bold text-purple-300 mb-3 mt-6">🎨 Colors:</h3>
              <div className="flex flex-wrap gap-2">
                <span className="bg-blue-500 px-2 py-1 rounded text-sm">blue</span>
                <span className="bg-pink-500 px-2 py-1 rounded text-sm">pink</span>
                <span className="bg-brown-500 px-2 py-1 rounded text-sm">brown</span>
                <span className="bg-red-500 px-2 py-1 rounded text-sm">red</span>
                <span className="bg-yellow-500 px-2 py-1 rounded text-sm">yellow</span>
                <span className="bg-green-500 px-2 py-1 rounded text-sm">green</span>
                <span className="bg-black px-2 py-1 rounded text-sm text-white">black</span>
                <span className="bg-purple-500 px-2 py-1 rounded text-sm">purple</span>
                <span className="bg-orange-500 px-2 py-1 rounded text-sm">orange</span>
                <span className="bg-gray-500 px-2 py-1 rounded text-sm">gray</span>
              </div>
            </div>

            <div className="bg-white flex-1 p-6 flex flex-col gap-4">
              <h3 className="text-xl font-bold text-purple-700 mb-2 text-center">✨ PRESENT PERFECT</h3>
              <div className="bg-green-100 text-gray-800 px-5 py-3 rounded-xl shadow-md text-center w-full">
                <span className="font-bold text-green-700">I have bought a new shirt.</span>
                <p className="text-sm text-gray-500 mt-1">Eu comprei uma camisa nova.</p>
              </div>
              <div className="bg-green-100 text-gray-800 px-5 py-3 rounded-xl shadow-md text-center w-full">
                <span className="font-bold text-green-700">She has worn that dress before.</span>
                <p className="text-sm text-gray-500 mt-1">Ela já usou aquele vestido antes.</p>
              </div>
              <div className="bg-green-100 text-gray-800 px-5 py-3 rounded-xl shadow-md text-center w-full">
                <span className="font-bold text-green-700">We have never tried this store.</span>
                <p className="text-sm text-gray-500 mt-1">Nós nunca experimentamos esta loja.</p>
              </div>
              
              <h3 className="text-xl font-bold text-purple-700 mb-2 mt-4 text-center">⏳ PAST PERFECT</h3>
              <div className="bg-blue-100 text-gray-800 px-5 py-3 rounded-xl shadow-md text-center w-full">
                <span className="font-bold text-blue-700">I had already changed my clothes when he arrived.</span>
                <p className="text-sm text-gray-500 mt-1">Eu já tinha trocado de roupa quando ele chegou.</p>
              </div>
              <div className="bg-blue-100 text-gray-800 px-5 py-3 rounded-xl shadow-md text-center w-full">
                <span className="font-bold text-blue-700">She had bought the shoes before the sale ended.</span>
                <p className="text-sm text-gray-500 mt-1">Ela tinha comprado os sapatos antes da liquidação acabar.</p>
              </div>
              <div className="bg-blue-100 text-gray-800 px-5 py-3 rounded-xl shadow-md text-center w-full">
                <span className="font-bold text-blue-700">They had never seen that style before.</span>
                <p className="text-sm text-gray-500 mt-1">Eles nunca tinham visto aquele estilo antes.</p>
              </div>
            </div>

            <div className="bg-purple-900 text-white flex-1 p-6 space-y-3 text-lg">
              <h3 className="text-xl font-bold text-purple-300 mb-3">📝 Grammar Notes:</h3>
              <div className="flex items-center gap-2">
                <span className="text-purple-300 text-2xl">•</span>
                <p><span className="font-bold text-purple-300">Present Perfect:</span> have/has + past participle</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-purple-300 text-2xl">•</span>
                <p>Used for <span className="font-bold text-purple-300">past experiences</span> and <span className="font-bold text-purple-300">recent actions</span></p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-purple-300 text-2xl">•</span>
                <p><span className="font-bold text-purple-300">Past Perfect:</span> had + past participle</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-purple-300 text-2xl">•</span>
                <p>Used for actions <span className="font-bold text-purple-300">completed before another past action</span></p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-purple-300 text-2xl">•</span>
                <p><span className="font-bold text-purple-300">Key words:</span> already, ever, never, before, yet</p>
              </div>
            </div>
          </div>
        </div>

        {/* Learning Objectives */}
        <div className="bg-purple-100 border-2 border-purple-300 rounded-[30px] p-6 mb-10">
          <h3 className="text-2xl font-bold text-purple-800 mb-4">✓ LEARNING OBJECTIVES</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center">
              <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2">✓</span>
              <span className="text-gray-800">Conjugar os verbos to wear e to change</span>
            </div>
            <div className="flex items-center">
              <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2">✓</span>
              <span className="text-gray-800">Vocabulário sobre roupas, acessórios e tamanhos</span>
            </div>
            <div className="flex items-center">
              <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2">✓</span>
              <span className="text-gray-800">Usar o Present Continuous para ações em andamento</span>
            </div>
            <div className="flex items-center">
              <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2">✓</span>
              <span className="text-gray-800">Usar o Present Perfect para experiências passadas</span>
            </div>
            <div className="flex items-center">
              <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2">✓</span>
              <span className="text-gray-800">Usar o Past Perfect para ações anteriores no passado</span>
            </div>
            <div className="flex items-center">
              <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2">✓</span>
              <span className="text-gray-800">Perguntar preços e experimentar roupas</span>
            </div>
          </div>
        </div>

        {/* Botão para próxima lição */}
        <div className="text-center">
          <button
            onClick={() => router.push("/cursos/lesson50")}
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-8 rounded-full transition-colors shadow-lg"
          >
            Next Lesson &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}