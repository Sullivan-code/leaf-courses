"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

type SectionKey = 'conversation' | 'expressions' | 'practice' | 'vocabulary';

export default function LessonOffshoreOQM_Lesson1() {
  const router = useRouter();
  const [openDrills, setOpenDrills] = useState({
    conversation: false,
    expressions: false,
    practice: false,
    vocabulary: false,
  });

  const toggleDrill = (section: SectionKey) => {
    setOpenDrills({
      ...openDrills,
      [section]: !openDrills[section]
    });
  };

  const playAudio = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      utterance.volume = 1;
      
      const voices = window.speechSynthesis.getVoices();
      const femaleVoice = voices.find(voice => 
        voice.lang === 'en-US' && 
        (voice.name.includes('Female') || 
         voice.name.includes('Samantha') || 
         voice.name.includes('Google US English'))
      );
      
      if (femaleVoice) {
        utterance.voice = femaleVoice;
      }
      
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div
      className="min-h-screen rounded-2xl py-16 px-6 bg-fixed"
      style={{
        backgroundImage: `url("https://images.pexels.com/photos/1430677/pexels-photo-1430677.jpeg?auto=compress&cs=tinysrgb&w=1600")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="max-w-5xl mx-auto bg-[#f0f8ff] bg-opacity-95 rounded-[40px] p-10 shadow-lg">
        
        {/* TITLE WITH OFFSHORE PLATFORM IMAGE */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-[#0c4a6e] mb-6">
            Lesson 1 - Offshore: Engine Room Problem
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            Listen to a conversation about a problem in the engine room. Learn useful expressions and idioms. ⚙️🔧
          </p>
          <div className="w-64 h-64 mx-auto relative">
            <Image
              src="https://raw.githubusercontent.com/Sullivan-code/english-audios/main/ChatGPT%20Image%20Jun%2012%2C%202026%2C%2006_28_56%20PM.png"
              alt="Offshore oil platform at sea"
              fill
              sizes="(max-width: 256px) 100vw, 256px"
              className="object-cover rounded-2xl shadow-md"
              quality={100}
              priority
            />
          </div>
          <p className="text-sm text-gray-500 mt-2">📍 Offshore Oil Platform - Engine Room</p>
        </div>

        {/* SECTION 1 - CONVERSATION */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">💬 Conversation</h2>
              <p className="mt-2 text-blue-100 italic">Listen to Mike and John talking about a problem in the engine room</p>
            </div>
            <button onClick={() => toggleDrill('conversation')} className="rounded-full bg-white text-blue-600 px-6 py-2 text-sm font-semibold">
              {openDrills.conversation ? 'Hide Translation' : 'Show Translation'}
            </button>
          </div>
          <div className="p-8">
            {/* Audio player for full conversation */}
            <div className="mb-6 bg-blue-50 rounded-xl p-4 border border-blue-200">
              <button
                onClick={() => playAudio("Mike: Hey John, can you come to the engine room? I think we have a problem. John: What's going on? Mike: The temperature is rising fast. It's through the roof! John: Whoa, hold your horses. Let me grab my tools and I'll be right there. Mike: Okay, but we need to act fast. This is getting out of hand. John: I hear you. I'm on my way. Mike: Thanks, man. You're a lifesaver. John: No problem. Let's get to the bottom of this. Mike: Sounds good. I'll check the pressure gauge while you look at the pump. John: Great idea. Let's put our heads together and fix this. Mike: I hope we can get it under control before the chief engineer finds out. John: Don't worry. We'll figure this out. We're a great team.")}
                className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-6 py-3 rounded-full font-semibold hover:from-blue-700 hover:to-cyan-600 transition-all duration-300"
              >
                🔊 Play Full Conversation
              </button>
            </div>

            {/* Conversation Dialog */}
            <div className="space-y-4">
              {/* Scene Setting */}
              <div className="bg-gray-100 p-3 rounded-xl text-center text-gray-600 italic">
                📍 Engine Room - 2:30 PM - Mike and John are on watch
              </div>

              {/* Line 1 - Mike */}
              <div className="bg-blue-50 p-4 rounded-xl border-l-8 border-blue-500 cursor-pointer hover:bg-blue-100 transition-colors" onClick={() => playAudio("Hey John, can you come to the engine room? I think we have a problem.")}>
                <div className="flex items-start gap-3">
                  <span className="text-2xl font-bold text-blue-700">Mike:</span>
                  <div className="flex-1">
                    <p className="text-gray-800">"Hey John, can you come to the engine room? I think we have a problem."</p>
                    {openDrills.conversation && (
                      <p className="text-gray-600 text-sm mt-1">🇧🇷 "Ei John, você pode vir à casa de máquinas? Acho que temos um problema."</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Line 2 - John */}
              <div className="bg-green-50 p-4 rounded-xl border-l-8 border-green-500 cursor-pointer hover:bg-green-100 transition-colors" onClick={() => playAudio("What's going on?")}>
                <div className="flex items-start gap-3">
                  <span className="text-2xl font-bold text-green-700">John:</span>
                  <div className="flex-1">
                    <p className="text-gray-800">"What's going on?"</p>
                    {openDrills.conversation && (
                      <p className="text-gray-600 text-sm mt-1">🇧🇷 "O que está acontecendo?"</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Line 3 - Mike */}
              <div className="bg-blue-50 p-4 rounded-xl border-l-8 border-blue-500 cursor-pointer hover:bg-blue-100 transition-colors" onClick={() => playAudio("The temperature is rising fast. It's through the roof!")}>
                <div className="flex items-start gap-3">
                  <span className="text-2xl font-bold text-blue-700">Mike:</span>
                  <div className="flex-1">
                    <p className="text-gray-800">"The temperature is rising fast. <span className="text-blue-600 font-semibold">It's through the roof!</span>"</p>
                    {openDrills.conversation && (
                      <p className="text-gray-600 text-sm mt-1">🇧🇷 "A temperatura está subindo rápido. <span className="text-blue-600 font-semibold">Está nas alturas!</span>"</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Line 4 - John */}
              <div className="bg-green-50 p-4 rounded-xl border-l-8 border-green-500 cursor-pointer hover:bg-green-100 transition-colors" onClick={() => playAudio("Whoa, hold your horses. Let me grab my tools and I'll be right there.")}>
                <div className="flex items-start gap-3">
                  <span className="text-2xl font-bold text-green-700">John:</span>
                  <div className="flex-1">
                    <p className="text-gray-800">"Whoa, <span className="text-green-600 font-semibold">hold your horses</span>. Let me grab my tools and I'll be right there."</p>
                    {openDrills.conversation && (
                      <p className="text-gray-600 text-sm mt-1">🇧🇷 "Calma, <span className="text-green-600 font-semibold">segura os cavalos</span>. Deixe eu pegar minhas ferramentas e já estou aí."</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Line 5 - Mike */}
              <div className="bg-blue-50 p-4 rounded-xl border-l-8 border-blue-500 cursor-pointer hover:bg-blue-100 transition-colors" onClick={() => playAudio("Okay, but we need to act fast. This is getting out of hand.")}>
                <div className="flex items-start gap-3">
                  <span className="text-2xl font-bold text-blue-700">Mike:</span>
                  <div className="flex-1">
                    <p className="text-gray-800">"Okay, but we need to act fast. This is <span className="text-blue-600 font-semibold">getting out of hand</span>."</p>
                    {openDrills.conversation && (
                      <p className="text-gray-600 text-sm mt-1">🇧🇷 "Ok, mas precisamos agir rápido. Isso está <span className="text-blue-600 font-semibold">ficando fora de controle</span>."</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Line 6 - John */}
              <div className="bg-green-50 p-4 rounded-xl border-l-8 border-green-500 cursor-pointer hover:bg-green-100 transition-colors" onClick={() => playAudio("I hear you. I'm on my way.")}>
                <div className="flex items-start gap-3">
                  <span className="text-2xl font-bold text-green-700">John:</span>
                  <div className="flex-1">
                    <p className="text-gray-800">"<span className="text-green-600 font-semibold">I hear you</span>. I'm on my way."</p>
                    {openDrills.conversation && (
                      <p className="text-gray-600 text-sm mt-1">🇧🇷 "<span className="text-green-600 font-semibold">Entendo você</span>. Estou indo."</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Line 7 - Mike */}
              <div className="bg-blue-50 p-4 rounded-xl border-l-8 border-blue-500 cursor-pointer hover:bg-blue-100 transition-colors" onClick={() => playAudio("Thanks, man. You're a lifesaver.")}>
                <div className="flex items-start gap-3">
                  <span className="text-2xl font-bold text-blue-700">Mike:</span>
                  <div className="flex-1">
                    <p className="text-gray-800">"Thanks, man. <span className="text-blue-600 font-semibold">You're a lifesaver</span>."</p>
                    {openDrills.conversation && (
                      <p className="text-gray-600 text-sm mt-1">🇧🇷 "Valeu, cara. <span className="text-blue-600 font-semibold">Você é um salva-vidas</span>."</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Line 8 - John */}
              <div className="bg-green-50 p-4 rounded-xl border-l-8 border-green-500 cursor-pointer hover:bg-green-100 transition-colors" onClick={() => playAudio("No problem. Let's get to the bottom of this.")}>
                <div className="flex items-start gap-3">
                  <span className="text-2xl font-bold text-green-700">John:</span>
                  <div className="flex-1">
                    <p className="text-gray-800">"No problem. <span className="text-green-600 font-semibold">Let's get to the bottom of this</span>."</p>
                    {openDrills.conversation && (
                      <p className="text-gray-600 text-sm mt-1">🇧🇷 "Sem problema. <span className="text-green-600 font-semibold">Vamos descobrir a causa disso</span>."</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Line 9 - Mike */}
              <div className="bg-blue-50 p-4 rounded-xl border-l-8 border-blue-500 cursor-pointer hover:bg-blue-100 transition-colors" onClick={() => playAudio("Sounds good. I'll check the pressure gauge while you look at the pump.")}>
                <div className="flex items-start gap-3">
                  <span className="text-2xl font-bold text-blue-700">Mike:</span>
                  <div className="flex-1">
                    <p className="text-gray-800">"Sounds good. I'll check the pressure gauge while you look at the pump."</p>
                    {openDrills.conversation && (
                      <p className="text-gray-600 text-sm mt-1">🇧🇷 "Parece bom. Vou verificar o manômetro enquanto você olha a bomba."</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Line 10 - John */}
              <div className="bg-green-50 p-4 rounded-xl border-l-8 border-green-500 cursor-pointer hover:bg-green-100 transition-colors" onClick={() => playAudio("Great idea. Let's put our heads together and fix this.")}>
                <div className="flex items-start gap-3">
                  <span className="text-2xl font-bold text-green-700">John:</span>
                  <div className="flex-1">
                    <p className="text-gray-800">"Great idea. <span className="text-green-600 font-semibold">Let's put our heads together</span> and fix this."</p>
                    {openDrills.conversation && (
                      <p className="text-gray-600 text-sm mt-1">🇧🇷 "Ótima ideia. <span className="text-green-600 font-semibold">Vamos juntar nossas cabeças</span> e consertar isso."</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Line 11 - Mike */}
              <div className="bg-blue-50 p-4 rounded-xl border-l-8 border-blue-500 cursor-pointer hover:bg-blue-100 transition-colors" onClick={() => playAudio("I hope we can get it under control before the chief engineer finds out.")}>
                <div className="flex items-start gap-3">
                  <span className="text-2xl font-bold text-blue-700">Mike:</span>
                  <div className="flex-1">
                    <p className="text-gray-800">"I hope we can <span className="text-blue-600 font-semibold">get it under control</span> before the chief engineer finds out."</p>
                    {openDrills.conversation && (
                      <p className="text-gray-600 text-sm mt-1">🇧🇷 "Espero que possamos <span className="text-blue-600 font-semibold">controlar isso</span> antes do chefe de máquinas descobrir."</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Line 12 - John */}
              <div className="bg-green-50 p-4 rounded-xl border-l-8 border-green-500 cursor-pointer hover:bg-green-100 transition-colors" onClick={() => playAudio("Don't worry. We'll figure this out. We're a great team.")}>
                <div className="flex items-start gap-3">
                  <span className="text-2xl font-bold text-green-700">John:</span>
                  <div className="flex-1">
                    <p className="text-gray-800">"Don't worry. We'll figure this out. <span className="text-green-600 font-semibold">We're a great team</span>."</p>
                    {openDrills.conversation && (
                      <p className="text-gray-600 text-sm mt-1">🇧🇷 "Não se preocupe. Nós vamos resolver isso. <span className="text-green-600 font-semibold">Somos uma ótima equipe</span>."</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2 - IDIOMATIC EXPRESSIONS */}
        <div className="bg-white border-2 border-purple-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-pink-500 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">⭐ Idiomatic Expressions</h2>
              <p className="mt-2 text-purple-100 italic">American English expressions used in the conversation</p>
            </div>
            <button onClick={() => toggleDrill('expressions')} className="rounded-full bg-white text-purple-600 px-6 py-2 text-sm font-semibold">
              {openDrills.expressions ? 'Hide Explanation' : 'Show Explanation'}
            </button>
          </div>
          <div className="p-8">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Expression 1 */}
              <div className="bg-purple-50 p-5 rounded-xl border border-purple-200 hover:bg-purple-100 transition-colors">
                <h3 className="text-xl font-bold text-purple-700">"Through the roof"</h3>
                <p className="text-gray-700 mt-2" onClick={() => playAudio("It's through the roof!")}>
                  <span className="font-semibold">Meaning:</span> Very high, extremely elevated
                </p>
                <p className="text-sm text-gray-600 mt-1" onClick={() => playAudio("The temperature is through the roof")}>
                  📌 <span className="font-semibold">Example:</span> "The temperature is through the roof!"
                </p>
                {openDrills.expressions && (
                  <div className="mt-3 p-3 bg-white rounded-lg border-l-4 border-purple-500 animate-fadeIn">
                    <p className="text-sm text-gray-700">🇧🇷 <span className="font-semibold">Significado:</span> Muito alto, extremamente elevado</p>
                    <p className="text-sm text-gray-700">💡 <span className="font-semibold">Use when:</span> Something is reaching extreme levels (temperature, pressure, prices)</p>
                    <p className="text-sm text-gray-700">🔄 <span className="font-semibold">Synonyms:</span> Sky-high, through the ceiling</p>
                  </div>
                )}
              </div>

              {/* Expression 2 */}
              <div className="bg-pink-50 p-5 rounded-xl border border-pink-200 hover:bg-pink-100 transition-colors">
                <h3 className="text-xl font-bold text-pink-700">"Hold your horses"</h3>
                <p className="text-gray-700 mt-2" onClick={() => playAudio("Hold your horses")}>
                  <span className="font-semibold">Meaning:</span> Wait, be patient, slow down
                </p>
                <p className="text-sm text-gray-600 mt-1" onClick={() => playAudio("Hold your horses, let me grab my tools")}>
                  📌 <span className="font-semibold">Example:</span> "Hold your horses, let me grab my tools."
                </p>
                {openDrills.expressions && (
                  <div className="mt-3 p-3 bg-white rounded-lg border-l-4 border-pink-500 animate-fadeIn">
                    <p className="text-sm text-gray-700">🇧🇷 <span className="font-semibold">Significado:</span> Espera, tenha paciência, se acalme</p>
                    <p className="text-sm text-gray-700">💡 <span className="font-semibold">Use when:</span> Someone is rushing or being impatient</p>
                    <p className="text-sm text-gray-700">🔄 <span className="font-semibold">Synonyms:</span> Take it easy, slow down, wait a minute</p>
                  </div>
                )}
              </div>

              {/* Expression 3 */}
              <div className="bg-blue-50 p-5 rounded-xl border border-blue-200 hover:bg-blue-100 transition-colors">
                <h3 className="text-xl font-bold text-blue-700">"Out of hand"</h3>
                <p className="text-gray-700 mt-2" onClick={() => playAudio("Getting out of hand")}>
                  <span className="font-semibold">Meaning:</span> Out of control, becoming unmanageable
                </p>
                <p className="text-sm text-gray-600 mt-1" onClick={() => playAudio("This is getting out of hand")}>
                  📌 <span className="font-semibold">Example:</span> "This is getting out of hand."
                </p>
                {openDrills.expressions && (
                  <div className="mt-3 p-3 bg-white rounded-lg border-l-4 border-blue-500 animate-fadeIn">
                    <p className="text-sm text-gray-700">🇧🇷 <span className="font-semibold">Significado:</span> Fora de controle, ficando incontrolável</p>
                    <p className="text-sm text-gray-700">💡 <span className="font-semibold">Use when:</span> A situation is becoming difficult to manage</p>
                    <p className="text-sm text-gray-700">🔄 <span className="font-semibold">Synonyms:</span> Spinning out of control, going crazy</p>
                  </div>
                )}
              </div>

              {/* Expression 4 */}
              <div className="bg-green-50 p-5 rounded-xl border border-green-200 hover:bg-green-100 transition-colors">
                <h3 className="text-xl font-bold text-green-700">"I hear you"</h3>
                <p className="text-gray-700 mt-2" onClick={() => playAudio("I hear you")}>
                  <span className="font-semibold">Meaning:</span> I understand you, I agree with you
                </p>
                <p className="text-sm text-gray-600 mt-1" onClick={() => playAudio("I hear you, I'm on my way")}>
                  📌 <span className="font-semibold">Example:</span> "I hear you, I'm on my way."
                </p>
                {openDrills.expressions && (
                  <div className="mt-3 p-3 bg-white rounded-lg border-l-4 border-green-500 animate-fadeIn">
                    <p className="text-sm text-gray-700">🇧🇷 <span className="font-semibold">Significado:</span> Entendo você, concordo com você</p>
                    <p className="text-sm text-gray-700">💡 <span className="font-semibold">Use when:</span> You want to show you understand and acknowledge someone</p>
                    <p className="text-sm text-gray-700">🔄 <span className="font-semibold">Synonyms:</span> I get it, I understand, Point taken</p>
                  </div>
                )}
              </div>

              {/* Expression 5 */}
              <div className="bg-yellow-50 p-5 rounded-xl border border-yellow-200 hover:bg-yellow-100 transition-colors">
                <h3 className="text-xl font-bold text-yellow-700">"Lifesaver"</h3>
                <p className="text-gray-700 mt-2" onClick={() => playAudio("You're a lifesaver")}>
                  <span className="font-semibold">Meaning:</span> Someone who helps in a difficult situation
                </p>
                <p className="text-sm text-gray-600 mt-1" onClick={() => playAudio("Thanks, you're a lifesaver")}>
                  📌 <span className="font-semibold">Example:</span> "Thanks, you're a lifesaver."
                </p>
                {openDrills.expressions && (
                  <div className="mt-3 p-3 bg-white rounded-lg border-l-4 border-yellow-500 animate-fadeIn">
                    <p className="text-sm text-gray-700">🇧🇷 <span className="font-semibold">Significado:</span> Alguém que ajuda em uma situação difícil</p>
                    <p className="text-sm text-gray-700">💡 <span className="font-semibold">Use when:</span> Someone helps you solve a problem or saves you from trouble</p>
                    <p className="text-sm text-gray-700">🔄 <span className="font-semibold">Synonyms:</span> Hero, savior, life-saver</p>
                  </div>
                )}
              </div>

              {/* Expression 6 */}
              <div className="bg-red-50 p-5 rounded-xl border border-red-200 hover:bg-red-100 transition-colors">
                <h3 className="text-xl font-bold text-red-700">"Get to the bottom of"</h3>
                <p className="text-gray-700 mt-2" onClick={() => playAudio("Let's get to the bottom of this")}>
                  <span className="font-semibold">Meaning:</span> Discover the real cause or truth
                </p>
                <p className="text-sm text-gray-600 mt-1" onClick={() => playAudio("Let's get to the bottom of this problem")}>
                  📌 <span className="font-semibold">Example:</span> "Let's get to the bottom of this problem."
                </p>
                {openDrills.expressions && (
                  <div className="mt-3 p-3 bg-white rounded-lg border-l-4 border-red-500 animate-fadeIn">
                    <p className="text-sm text-gray-700">🇧🇷 <span className="font-semibold">Significado:</span> Descobrir a verdadeira causa</p>
                    <p className="text-sm text-gray-700">💡 <span className="font-semibold">Use when:</span> You need to investigate and find the root cause of a problem</p>
                    <p className="text-sm text-gray-700">🔄 <span className="font-semibold">Synonyms:</span> Investigate, find the source, uncover the truth</p>
                  </div>
                )}
              </div>

              {/* Expression 7 */}
              <div className="bg-indigo-50 p-5 rounded-xl border border-indigo-200 hover:bg-indigo-100 transition-colors">
                <h3 className="text-xl font-bold text-indigo-700">"Put our heads together"</h3>
                <p className="text-gray-700 mt-2" onClick={() => playAudio("Let's put our heads together")}>
                  <span className="font-semibold">Meaning:</span> Work together to solve a problem
                </p>
                <p className="text-sm text-gray-600 mt-1" onClick={() => playAudio("Let's put our heads together and fix this")}>
                  📌 <span className="font-semibold">Example:</span> "Let's put our heads together and fix this."
                </p>
                {openDrills.expressions && (
                  <div className="mt-3 p-3 bg-white rounded-lg border-l-4 border-indigo-500 animate-fadeIn">
                    <p className="text-sm text-gray-700">🇧🇷 <span className="font-semibold">Significado:</span> Trabalhar juntos para resolver um problema</p>
                    <p className="text-sm text-gray-700">💡 <span className="font-semibold">Use when:</span> You want to collaborate and use everyone's knowledge</p>
                    <p className="text-sm text-gray-700">🔄 <span className="font-semibold">Synonyms:</span> Brainstorm, collaborate, team up</p>
                  </div>
                )}
              </div>

              {/* Expression 8 */}
              <div className="bg-teal-50 p-5 rounded-xl border border-teal-200 hover:bg-teal-100 transition-colors">
                <h3 className="text-xl font-bold text-teal-700">"Under control"</h3>
                <p className="text-gray-700 mt-2" onClick={() => playAudio("Get it under control")}>
                  <span className="font-semibold">Meaning:</span> Manage or handle a situation effectively
                </p>
                <p className="text-sm text-gray-600 mt-1" onClick={() => playAudio("We need to get it under control")}>
                  📌 <span className="font-semibold">Example:</span> "We need to get it under control."
                </p>
                {openDrills.expressions && (
                  <div className="mt-3 p-3 bg-white rounded-lg border-l-4 border-teal-500 animate-fadeIn">
                    <p className="text-sm text-gray-700">🇧🇷 <span className="font-semibold">Significado:</span> Controlar ou gerenciar uma situação efetivamente</p>
                    <p className="text-sm text-gray-700">💡 <span className="font-semibold">Use when:</span> You need to manage a problem before it gets worse</p>
                    <p className="text-sm text-gray-700">🔄 <span className="font-semibold">Synonyms:</span> Manage, handle, keep in check</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3 - PRACTICE EXERCISES */}
        <div className="bg-white border-2 border-orange-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">✏️ Practice Exercises</h2>
              <p className="mt-2 text-orange-100 italic">Complete the sentences with the correct expression</p>
            </div>
            <button onClick={() => toggleDrill('practice')} className="rounded-full bg-white text-orange-600 px-6 py-2 text-sm font-semibold">
              {openDrills.practice ? 'Hide Answers' : 'Show Answers'}
            </button>
          </div>
          <div className="p-8">
            <div className="space-y-4">
              <div className="bg-orange-50 p-4 rounded-xl border border-orange-200">
                <p className="text-gray-800 font-medium">1. The temperature is rising fast. It's _________!</p>
                {openDrills.practice && (
                  <div className="mt-2 p-2 bg-green-100 rounded border-l-4 border-green-500 animate-fadeIn">
                    <p className="text-green-700 font-semibold">✅ Answer: through the roof</p>
                    <p className="text-sm text-gray-600">"The temperature is rising fast. It's <strong>through the roof</strong>!"</p>
                  </div>
                )}
              </div>

              <div className="bg-orange-50 p-4 rounded-xl border border-orange-200">
                <p className="text-gray-800 font-medium">2. _________! Let me grab my tools first.</p>
                {openDrills.practice && (
                  <div className="mt-2 p-2 bg-green-100 rounded border-l-4 border-green-500 animate-fadeIn">
                    <p className="text-green-700 font-semibold">✅ Answer: Hold your horses</p>
                    <p className="text-sm text-gray-600"><strong>Hold your horses</strong>! Let me grab my tools first."</p>
                  </div>
                )}
              </div>

              <div className="bg-orange-50 p-4 rounded-xl border border-orange-200">
                <p className="text-gray-800 font-medium">3. This situation is getting _________. We need to act now!</p>
                {openDrills.practice && (
                  <div className="mt-2 p-2 bg-green-100 rounded border-l-4 border-green-500 animate-fadeIn">
                    <p className="text-green-700 font-semibold">✅ Answer: out of hand</p>
                    <p className="text-sm text-gray-600">"This situation is getting <strong>out of hand</strong>. We need to act now!"</p>
                  </div>
                )}
              </div>

              <div className="bg-orange-50 p-4 rounded-xl border border-orange-200">
                <p className="text-gray-800 font-medium">4. Thanks for helping me fix the pump. You're a _________!</p>
                {openDrills.practice && (
                  <div className="mt-2 p-2 bg-green-100 rounded border-l-4 border-green-500 animate-fadeIn">
                    <p className="text-green-700 font-semibold">✅ Answer: lifesaver</p>
                    <p className="text-sm text-gray-600">"Thanks for helping me fix the pump. You're a <strong>lifesaver</strong>!"</p>
                  </div>
                )}
              </div>

              <div className="bg-orange-50 p-4 rounded-xl border border-orange-200">
                <p className="text-gray-800 font-medium">5. Let's work together to solve this. Let's _________!</p>
                {openDrills.practice && (
                  <div className="mt-2 p-2 bg-green-100 rounded border-l-4 border-green-500 animate-fadeIn">
                    <p className="text-green-700 font-semibold">✅ Answer: put our heads together</p>
                    <p className="text-sm text-gray-600">"Let's work together to solve this. Let's <strong>put our heads together</strong>!"</p>
                  </div>
                )}
              </div>

              <div className="bg-orange-50 p-4 rounded-xl border border-orange-200">
                <p className="text-gray-800 font-medium">6. We need to _________ this problem before the chief engineer arrives.</p>
                {openDrills.practice && (
                  <div className="mt-2 p-2 bg-green-100 rounded border-l-4 border-green-500 animate-fadeIn">
                    <p className="text-green-700 font-semibold">✅ Answer: get to the bottom of</p>
                    <p className="text-sm text-gray-600">"We need to <strong>get to the bottom of</strong> this problem before the chief engineer arrives."</p>
                  </div>
                )}
              </div>

              <div className="bg-orange-50 p-4 rounded-xl border border-orange-200">
                <p className="text-gray-800 font-medium">7. I understand your concern. _________, let's fix this together.</p>
                {openDrills.practice && (
                  <div className="mt-2 p-2 bg-green-100 rounded border-l-4 border-green-500 animate-fadeIn">
                    <p className="text-green-700 font-semibold">✅ Answer: I hear you</p>
                    <p className="text-sm text-gray-600">"<strong>I hear you</strong>, let's fix this together."</p>
                  </div>
                )}
              </div>

              <div className="bg-orange-50 p-4 rounded-xl border border-orange-200">
                <p className="text-gray-800 font-medium">8. The pressure is rising. We need to _________ before it's too late.</p>
                {openDrills.practice && (
                  <div className="mt-2 p-2 bg-green-100 rounded border-l-4 border-green-500 animate-fadeIn">
                    <p className="text-green-700 font-semibold">✅ Answer: get it under control</p>
                    <p className="text-sm text-gray-600">"The pressure is rising. We need to <strong>get it under control</strong> before it's too late."</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 4 - KEY VOCABULARY */}
        <div className="bg-white border-2 border-green-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-emerald-500 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">📚 Key Vocabulary</h2>
              <p className="mt-2 text-green-100 italic">Essential words from the conversation</p>
            </div>
            <button onClick={() => toggleDrill('vocabulary')} className="rounded-full bg-white text-green-600 px-6 py-2 text-sm font-semibold">
              {openDrills.vocabulary ? 'Hide Translations' : 'Show Translations'}
            </button>
          </div>
          <div className="p-8">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-green-50 p-4 rounded-xl border border-green-200 hover:bg-green-100 transition-colors cursor-pointer" onClick={() => playAudio("engine room")}>
                <p className="font-bold text-green-800">Engine Room</p>
                <p className="text-gray-600">Casa de máquinas</p>
                {openDrills.vocabulary && (
                  <p className="text-sm text-gray-500 mt-1">📌 The place where the main engines are located</p>
                )}
              </div>

              <div className="bg-green-50 p-4 rounded-xl border border-green-200 hover:bg-green-100 transition-colors cursor-pointer" onClick={() => playAudio("temperature")}>
                <p className="font-bold text-green-800">Temperature</p>
                <p className="text-gray-600">Temperatura</p>
                {openDrills.vocabulary && (
                  <p className="text-sm text-gray-500 mt-1">📌 How hot or cold something is</p>
                )}
              </div>

              <div className="bg-green-50 p-4 rounded-xl border border-green-200 hover:bg-green-100 transition-colors cursor-pointer" onClick={() => playAudio("pressure gauge")}>
                <p className="font-bold text-green-800">Pressure Gauge</p>
                <p className="text-gray-600">Manômetro</p>
                {openDrills.vocabulary && (
                  <p className="text-sm text-gray-500 mt-1">📌 Instrument that measures pressure</p>
                )}
              </div>

              <div className="bg-green-50 p-4 rounded-xl border border-green-200 hover:bg-green-100 transition-colors cursor-pointer" onClick={() => playAudio("pump")}>
                <p className="font-bold text-green-800">Pump</p>
                <p className="text-gray-600">Bomba</p>
                {openDrills.vocabulary && (
                  <p className="text-sm text-gray-500 mt-1">📌 Machine that moves liquids or gases</p>
                )}
              </div>

              <div className="bg-green-50 p-4 rounded-xl border border-green-200 hover:bg-green-100 transition-colors cursor-pointer" onClick={() => playAudio("tools")}>
                <p className="font-bold text-green-800">Tools</p>
                <p className="text-gray-600">Ferramentas</p>
                {openDrills.vocabulary && (
                  <p className="text-sm text-gray-500 mt-1">📌 Equipment used to fix or build things</p>
                )}
              </div>

              <div className="bg-green-50 p-4 rounded-xl border border-green-200 hover:bg-green-100 transition-colors cursor-pointer" onClick={() => playAudio("chief engineer")}>
                <p className="font-bold text-green-800">Chief Engineer</p>
                <p className="text-gray-600">Chefe de Máquinas</p>
                {openDrills.vocabulary && (
                  <p className="text-sm text-gray-500 mt-1">📌 The head of the engineering department</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 5 - WRAP UP */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-4 px-8">
            <h2 className="text-3xl font-bold">🔹 WRAP UP</h2>
            <p className="mt-2 text-blue-100 italic">What did we learn in this lesson?</p>
          </div>
          <div className="p-8">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-blue-50 p-5 rounded-xl border border-blue-200 text-center">
                <span className="text-4xl">💬</span>
                <h3 className="font-bold text-blue-800 mt-2">Conversation</h3>
                <p className="text-sm text-gray-600 mt-1">We listened to Mike and John talking about a problem in the engine room.</p>
              </div>

              <div className="bg-purple-50 p-5 rounded-xl border border-purple-200 text-center">
                <span className="text-4xl">⭐</span>
                <h3 className="font-bold text-purple-800 mt-2">Idioms</h3>
                <p className="text-sm text-gray-600 mt-1">We learned 8 American English idiomatic expressions used in the conversation.</p>
              </div>

              <div className="bg-green-50 p-5 rounded-xl border border-green-200 text-center">
                <span className="text-4xl">📚</span>
                <h3 className="font-bold text-green-800 mt-2">Vocabulary</h3>
                <p className="text-sm text-gray-600 mt-1">We learned essential vocabulary for working in the engine room.</p>
              </div>
            </div>

            <div className="mt-6 bg-yellow-50 p-4 rounded-xl border border-yellow-200">
              <p className="text-center text-gray-700">
                💡 <span className="font-bold">Tip:</span> Practice using these idioms in your daily conversations on the platform. They will make you sound more natural and fluent in English!
              </p>
            </div>
          </div>
        </div>

        {/* NEXT LESSON BUTTON */}
        <div className="text-center">
          <button
            onClick={() => router.push("/cursos/offshore/lesson7-offshore")}
            className="inline-block rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-8 py-3 text-lg transition-all duration-300 hover:from-cyan-600 hover:to-blue-700"
          >
            Next Lesson
          </button>
        </div>
      </div>

      <style jsx>{`
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
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}