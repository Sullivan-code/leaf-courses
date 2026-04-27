"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, Check, XCircle, ArrowLeft, ArrowRight } from "lucide-react";

// ============================================
// LESSON 50 - CLOTHES, DESCRIPTIONS & THERE WAS/WERE
// ============================================

// ============================================
// GRAMMAR EXPLANATION - THERE WAS / WERE
// ============================================
const grammarExplanation = {
  thereWas: {
    title: "THERE WAS - Singular",
    explanation: "Usado para falar sobre UMA coisa que existia no passado.",
    examples: ["There was a car outside.", "There was a problem.", "There was a beautiful house."],
    negative: "There wasn't (was not)",
    negativeExamples: ["There wasn't any water.", "There wasn't a doctor."]
  },
  thereWere: {
    title: "THERE WERE - Plural",
    explanation: "Usado para falar sobre MAIS DE UMA coisa que existia no passado.",
    examples: ["There were many people.", "There were two options.", "There were several chairs."],
    negative: "There weren't (were not)",
    negativeExamples: ["There weren't any chairs.", "There weren't many students."]
  }
};

// ============================================
// SPEAK RIGHT NOW - DESCRIBING PEOPLE (10 SITUATIONS)
// ============================================
const speakRightNowItems = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format",
    alt: "Man with white T-shirt and jeans",
    description: "👨 Man: white T-shirt + jeans",
    pronoun: "He",
    example: "He is wearing a white T-shirt and blue jeans."
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=500&auto=format",
    alt: "Woman with elegant blue dress",
    description: "👩 Woman: elegant blue dress",
    pronoun: "She",
    example: "She is wearing an elegant blue dress."
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=500&auto=format",
    alt: "Gentleman with black suit and tie",
    description: "👨‍🦳 Gentleman: black suit + tie",
    pronoun: "He",
    example: "He is wearing a black suit and a tie."
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1521119989659-a83eee488004?w=500&auto=format",
    alt: "Young man with denim jacket and sneakers",
    description: "🧑 Young man: denim jacket + sneakers",
    pronoun: "He",
    example: "He is wearing a denim jacket and white sneakers."
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=500&auto=format",
    alt: "Girl with pink dress",
    description: "👧 Girl: pink dress",
    pronoun: "She",
    example: "She is wearing a lovely pink dress."
  },
  {
    id: 6,
    image: "https://images.unsplash.com/photo-1529333166437-77579a9dd4c6?w=500&auto=format",
    alt: "Couple in casual clothes",
    description: "💑 Couple: casual clothes (t-shirt + shorts)",
    pronoun: "They",
    example: "They are wearing casual T-shirts and shorts."
  },
  {
    id: 7,
    image: "https://images.unsplash.com/photo-1577221084712-45b0445d2b00?w=500&auto=format",
    alt: "Woman in gym outfit",
    description: "🏋️ Woman: gym outfit",
    pronoun: "She",
    example: "She is wearing a pink tank top and black leggings."
  },
  {
    id: 8,
    image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500&auto=format",
    alt: "Man in hoodie and sweatpants",
    description: "🧥 Man: hoodie + sweatpants",
    pronoun: "He",
    example: "He is wearing a comfortable hoodie and black sweatpants."
  },
  {
    id: 9,
    image: "https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=500&auto=format",
    alt: "Two kids in colorful clothes",
    description: "👧🧒 Two children: colorful clothes",
    pronoun: "They",
    example: "They are wearing colorful T-shirts and shorts."
  },
  {
    id: 10,
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&auto=format",
    alt: "Woman in yellow dress with hat",
    description: "👒 Woman: yellow dress + hat",
    pronoun: "She",
    example: "She is wearing a beautiful yellow dress and a straw hat."
  }
];

// ============================================
// PRACTICE B - DIALOGUE COMPLETION (THERE WAS/WERE)
// ============================================
const practiceBExercises = [
  { key: "pb-1", text: "But when I got to the hotel I was thirsty but ______ any bottle of water at the front desk.", answer: "there wasn't" },
  { key: "pb-2", text: "I don't believe it!! ______ a vending machine at the lobby?", answer: "Was there" },
  { key: "pb-3", text: "Yes, ______. But ______ many people working that day so ______ anyone to fill the machine.", answer: "there was / there were / there wasn't" },
  { key: "pb-4", text: "Well, I'm sure ______ other people dealing with the same problem.", answer: "there were" },
  { key: "pb-5", text: "Yes, ______ many others complaining and ______ all the items available.", answer: "there were / there weren't" }
];

// ============================================
// PRACTICE C - MULTIPLE CHOICE
// ============================================
const practiceCExercises = [
  { key: "pc-1", question: "_____ many people at the newsstand.", options: ["a) There was", "b) There", "c) There were"], correct: "c) There were" },
  { key: "pc-2", question: "_____ a group of workers willing to strike.", options: ["a) There is", "b) There were", "c) There was"], correct: "c) There was" },
  { key: "pc-3", question: "_____ a lost dog wandering on the street.", options: ["a) Have", "b) There was", "c) There were"], correct: "b) There was" },
  { key: "pc-4", question: "How many people _____ at the party?", options: ["a) was there", "b) had", "c) were there"], correct: "c) were there" },
  { key: "pc-5", question: "_____ any food left in the fridge.", options: ["a) There weren't", "b) There had", "c) There wasn't"], correct: "c) There wasn't" }
];

// ============================================
// PERSONAL QUESTIONS (CLOTHES & FASHION)
// ============================================
const personalQuestions = [
  { id: 1, question: "Do you usually try on clothes at the mall?" },
  { id: 2, question: "What do you like to wear to go out?" },
  { id: 3, question: "What do you usually wear to work?" },
  { id: 4, question: "How often do you wear sunglasses?" },
  { id: 5, question: "Do you prefer to wear shirts or T-shirts?" },
  { id: 6, question: "Do you have a favorite pair of shoes?" },
  { id: 7, question: "Do you like fashion?" },
  { id: 8, question: "What size is your father / mother?" },
  { id: 9, question: "What's your favorite color?" },
  { id: 10, question: "How often do you buy clothes or shoes?" }
];

// ============================================
// UTILITY FUNCTIONS
// ============================================
const normalizeText = (text: string): string => {
  return text.toLowerCase().trim().replace(/[.,?!]/g, '').replace(/\s+/g, ' ');
};

const checkAnswer = (userAnswer: string, correctAnswer: string): boolean => {
  return normalizeText(userAnswer) === normalizeText(correctAnswer);
};

// ============================================
// COMPONENTS
// ============================================
const AnswerResult = ({ isCorrect, correctAnswer }: { isCorrect: boolean; correctAnswer: string }) => {
  if (isCorrect) {
    return (
      <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded-md mt-2">
        <Check size={16} className="text-green-600" />
        <span className="text-sm text-green-700 font-medium">Correct!</span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-2 p-2 bg-red-50 border border-red-200 rounded-md mt-2">
      <XCircle size={16} className="text-red-600" />
      <span className="text-sm text-red-700">
        <span className="font-medium">Expected:</span> {correctAnswer}
      </span>
    </div>
  );
};

const GrammarExplanation = () => {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-300 rounded-[30px] shadow-lg mb-10 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-4 px-8">
        <h2 className="text-2xl font-bold text-center">🔵 GRAMMAR TIME – THERE WAS / THERE WERE</h2>
      </div>
      <div className="p-8 grid md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl border-2 border-blue-200 shadow-md">
          <h3 className="text-xl font-bold text-blue-700 mb-3">✅ THERE WAS (singular)</h3>
          <p className="text-gray-700 mb-3">{grammarExplanation.thereWas.explanation}</p>
          <div className="bg-blue-50 p-3 rounded-lg mb-3">
            <p className="font-semibold text-blue-800">📝 Exemplos:</p>
            <ul className="list-disc list-inside text-gray-700">
              {grammarExplanation.thereWas.examples.map((ex, i) => <li key={i}>{ex}</li>)}
            </ul>
          </div>
          <div className="bg-red-50 p-3 rounded-lg">
            <p className="font-semibold text-red-800">❌ THERE WASN'T (negativo)</p>
            <ul className="list-disc list-inside text-gray-700">
              {grammarExplanation.thereWas.negativeExamples.map((ex, i) => <li key={i}>{ex}</li>)}
            </ul>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border-2 border-green-200 shadow-md">
          <h3 className="text-xl font-bold text-green-700 mb-3">✅ THERE WERE (plural)</h3>
          <p className="text-gray-700 mb-3">{grammarExplanation.thereWere.explanation}</p>
          <div className="bg-green-50 p-3 rounded-lg mb-3">
            <p className="font-semibold text-green-800">📝 Exemplos:</p>
            <ul className="list-disc list-inside text-gray-700">
              {grammarExplanation.thereWere.examples.map((ex, i) => <li key={i}>{ex}</li>)}
            </ul>
          </div>
          <div className="bg-red-50 p-3 rounded-lg">
            <p className="font-semibold text-red-800">❌ THERE WEREN'T (negativo)</p>
            <ul className="list-disc list-inside text-gray-700">
              {grammarExplanation.thereWere.negativeExamples.map((ex, i) => <li key={i}>{ex}</li>)}
            </ul>
          </div>
        </div>
      </div>
      <div className="px-8 pb-6">
        <div className="bg-indigo-100 p-4 rounded-xl">
          <p className="font-mono text-indigo-800">📌 Perguntas: <strong>Was there a restaurant?</strong> / <strong>Were there many people?</strong></p>
        </div>
      </div>
    </div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================
export default function Lesson50() {
  const router = useRouter();

  // Section visibility
  const [sections, setSections] = useState({
    grammar: true,
    speakRightNow: true,
    questions: true,
    grammarTime: true,
    practiceB: true,
    practiceC: true,
    speaking: true
  });

  // Exercise states
  const [writtenAnswers, setWrittenAnswers] = useState<Record<string, string>>({});
  const [answerResults, setAnswerResults] = useState<Record<string, boolean>>({});
  const [showAnswerResults, setShowAnswerResults] = useState<Record<string, boolean>>({});
  const [personalAnswers, setPersonalAnswers] = useState<Record<number, string>>({});
  const [speakingOutput, setSpeakingOutput] = useState("");

  // Speak Right Now - user created sentences
  const [userSentences, setUserSentences] = useState<Record<number, string>>({});

  // ============================================
  // PERSISTENCE
  // ============================================
  useEffect(() => {
    const saved = localStorage.getItem("lesson50Answers");
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setWrittenAnswers(data.writtenAnswers || {});
        setAnswerResults(data.answerResults || {});
        setShowAnswerResults(data.showAnswerResults || {});
        setPersonalAnswers(data.personalAnswers || {});
        setUserSentences(data.userSentences || {});
        setSpeakingOutput(data.speakingOutput || "");
        if (data.sections) setSections(data.sections);
        console.log("✅ Lesson 50 data loaded");
      } catch (e) { console.error(e); }
    }
  }, []);

  const saveAllAnswers = () => {
    const data = {
      writtenAnswers,
      answerResults,
      showAnswerResults,
      personalAnswers,
      userSentences,
      speakingOutput,
      sections,
      lastUpdated: new Date().toISOString(),
      lessonName: "Lesson 50 - Clothes & There Was/Were"
    };
    localStorage.setItem("lesson50Answers", JSON.stringify(data));
    alert("✅ All answers saved!");
  };

  const clearAllAnswers = () => {
    if (confirm("Clear ALL answers?")) {
      setWrittenAnswers({});
      setAnswerResults({});
      setShowAnswerResults({});
      setPersonalAnswers({});
      setUserSentences({});
      setSpeakingOutput("");
      localStorage.removeItem("lesson50Answers");
      alert("✅ Cleared!");
    }
  };

  const toggleSection = (section: keyof typeof sections) => {
    setSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleWrittenChange = (key: string, value: string) => {
    setWrittenAnswers(prev => ({ ...prev, [key]: value }));
  };

  const handleCheck = (key: string, userAnswer: string, correctAnswer: string) => {
    const isCorrect = checkAnswer(userAnswer, correctAnswer);
    setAnswerResults(prev => ({ ...prev, [key]: isCorrect }));
    setShowAnswerResults(prev => ({ ...prev, [key]: true }));
  };

  const handlePersonalChange = (id: number, value: string) => {
    setPersonalAnswers(prev => ({ ...prev, [id]: value }));
  };

  const handleSentenceChange = (id: number, value: string) => {
    setUserSentences(prev => ({ ...prev, [id]: value }));
  };

  return (
    <div className="min-h-screen py-16 px-6 bg-cover bg-fixed" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2070')` }}>
      <div className="max-w-6xl mx-auto bg-white/95 backdrop-blur-sm rounded-[40px] p-10 shadow-2xl border border-gray-200">
        
        {/* HEADER */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-purple-900 mb-4">📘 LESSON 50 – CLOTHES, DESCRIPTIONS & THERE WAS / WERE</h1>
          <p className="text-xl text-gray-700 max-w-4xl mx-auto">
            Describe what people are wearing · Talk about past existence with <span className="font-bold text-blue-600">There was / There were</span>
          </p>
        </div>

        {/* ========== SPEAK RIGHT NOW ========== */}
        <div className="bg-pink-50 border-2 border-pink-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-pink-500 text-white py-4 px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🎤 SPEAK RIGHT NOW – Describing People</h2>
              <button onClick={() => toggleSection('speakRightNow')} className="ml-4 p-2 rounded-full hover:bg-pink-600">
                {sections.speakRightNow ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
          </div>
          {sections.speakRightNow && (
            <div className="p-8">
              <p className="text-gray-700 mb-6"><strong>💡 Model:</strong> <span className="bg-pink-100 px-3 py-1 rounded-full font-mono">He is wearing a white T-shirt.</span> Create your own sentences changing pronoun, color and clothing.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {speakRightNowItems.map((item) => (
                  <div key={item.id} className="bg-white rounded-2xl border border-pink-200 overflow-hidden shadow-md hover:shadow-lg transition">
                    <div className="h-48 w-full relative">
                      <Image src={item.image} alt={item.alt} fill className="object-cover" />
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-pink-600 font-semibold">{item.description}</p>
                      <input
                        type="text"
                        placeholder={`${item.pronoun} is wearing...`}
                        value={userSentences[item.id] || ""}
                        onChange={(e) => handleSentenceChange(item.id, e.target.value)}
                        className="w-full mt-3 p-2 border border-gray-300 rounded-xl text-sm focus:ring-pink-500"
                      />
                      <details className="mt-2">
                        <summary className="text-xs text-gray-400 cursor-pointer">✨ example</summary>
                        <p className="text-xs bg-gray-50 p-2 rounded mt-1">{item.example}</p>
                      </details>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 bg-yellow-50 p-4 rounded-xl border border-yellow-200">
                <p className="font-medium text-gray-700">✨ <strong>Your turn!</strong> Create at least 10 sentences changing pronoun (He/She/They), colors and clothing items.</p>
              </div>
            </div>
          )}
        </div>

        {/* ========== PERSONAL QUESTIONS ========== */}
        <div className="bg-indigo-50 border-2 border-indigo-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-indigo-600 text-white py-4 px-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold">🟡 PERSONAL QUESTIONS – Clothes & Fashion</h2>
            <button onClick={() => toggleSection('questions')} className="ml-4 p-2 rounded-full hover:bg-indigo-700">
              {sections.questions ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
            </button>
          </div>
          {sections.questions && (
            <div className="p-8">
              <div className="grid md:grid-cols-2 gap-4">
                {personalQuestions.map((q) => (
                  <div key={q.id} className="bg-white p-4 rounded-xl border border-indigo-200">
                    <p className="font-semibold text-indigo-700 mb-2">{q.id}. {q.question}</p>
                    <textarea
                      rows={2}
                      value={personalAnswers[q.id] || ""}
                      onChange={(e) => handlePersonalChange(q.id, e.target.value)}
                      placeholder="Write your answer..."
                      className="w-full p-2 border border-gray-300 rounded-md text-sm"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ========== GRAMMAR TIME ========== */}
        <GrammarExplanation />

        {/* ========== PRACTICE B ========== */}
        <div className="bg-purple-50 border-2 border-purple-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-purple-600 text-white py-4 px-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold">🟠 PRACTICE B – Complete with there was/were/wasn't/weren't</h2>
            <button onClick={() => toggleSection('practiceB')} className="ml-4 p-2 rounded-full hover:bg-purple-700">
              {sections.practiceB ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
            </button>
          </div>
          {sections.practiceB && (
            <div className="p-8">
              <div className="bg-white p-6 rounded-2xl shadow-md space-y-4">
                <p><strong>A –</strong> Hi Vic. How was your trip to the USA?<br />
                <strong>B –</strong> It was pretty nice Josh. But when I got to the hotel I was thirsty but ______ any bottle of water at the front desk.</p>
                <div className="flex gap-2"><input type="text" className="flex-1 border rounded p-2" value={writtenAnswers["pb-1"] || ""} onChange={(e) => handleWrittenChange("pb-1", e.target.value)} /><button onClick={() => handleCheck("pb-1", writtenAnswers["pb-1"] || "", "there wasn't")} className="bg-purple-500 text-white px-4 rounded">Check</button></div>
                {showAnswerResults["pb-1"] && <AnswerResult isCorrect={answerResults["pb-1"]} correctAnswer="there wasn't" />}
                <div className="answer-hidden-tag bg-yellow-100 p-2 rounded text-xs border-l-4 border-yellow-500 mt-2">🔒 RESPOSTA: there wasn't</div>

                <p><strong>A –</strong> I don't believe it!! ______ a vending machine at the lobby?</p>
                <div className="flex gap-2"><input type="text" className="flex-1 border rounded p-2" value={writtenAnswers["pb-2"] || ""} onChange={(e) => handleWrittenChange("pb-2", e.target.value)} /><button onClick={() => handleCheck("pb-2", writtenAnswers["pb-2"] || "", "Was there")} className="bg-purple-500 text-white px-4 rounded">Check</button></div>
                {showAnswerResults["pb-2"] && <AnswerResult isCorrect={answerResults["pb-2"]} correctAnswer="Was there" />}
                <div className="answer-hidden-tag bg-yellow-100 p-2 rounded text-xs">🔒 RESPOSTA: Was there</div>

                <p><strong>B –</strong> Yes, ______. But ______ many people working that day so ______ anyone to fill the machine.</p>
                <div className="flex gap-2"><input type="text" className="flex-1 border rounded p-2" placeholder="answer1 / answer2 / answer3" value={writtenAnswers["pb-3"] || ""} onChange={(e) => handleWrittenChange("pb-3", e.target.value)} /><button onClick={() => handleCheck("pb-3", writtenAnswers["pb-3"] || "", "there was / there were / there wasn't")} className="bg-purple-500 text-white px-4 rounded">Check</button></div>
                {showAnswerResults["pb-3"] && <AnswerResult isCorrect={answerResults["pb-3"]} correctAnswer="there was / there were / there wasn't" />}
                <div className="answer-hidden-tag bg-yellow-100 p-2 rounded text-xs">🔒 RESPOSTAS: there was / there were / there wasn't</div>

                <p><strong>A –</strong> Well, I'm sure ______ other people dealing with the same problem.</p>
                <div className="flex gap-2"><input type="text" className="flex-1 border rounded p-2" value={writtenAnswers["pb-4"] || ""} onChange={(e) => handleWrittenChange("pb-4", e.target.value)} /><button onClick={() => handleCheck("pb-4", writtenAnswers["pb-4"] || "", "there were")} className="bg-purple-500 text-white px-4 rounded">Check</button></div>
                {showAnswerResults["pb-4"] && <AnswerResult isCorrect={answerResults["pb-4"]} correctAnswer="there were" />}
                <div className="answer-hidden-tag bg-yellow-100 p-2 rounded text-xs">🔒 RESPOSTA: there were</div>

                <p><strong>B –</strong> Yes, ______ many others complaining and ______ all the items available.</p>
                <div className="flex gap-2"><input type="text" className="flex-1 border rounded p-2" placeholder="there were / there weren't" value={writtenAnswers["pb-5"] || ""} onChange={(e) => handleWrittenChange("pb-5", e.target.value)} /><button onClick={() => handleCheck("pb-5", writtenAnswers["pb-5"] || "", "there were / there weren't")} className="bg-purple-500 text-white px-4 rounded">Check</button></div>
                {showAnswerResults["pb-5"] && <AnswerResult isCorrect={answerResults["pb-5"]} correctAnswer="there were / there weren't" />}
                <div className="answer-hidden-tag bg-yellow-100 p-2 rounded text-xs">🔒 RESPOSTAS: there were / there weren't</div>
              </div>
            </div>
          )}
        </div>

        {/* ========== PRACTICE C ========== */}
        <div className="bg-amber-50 border-2 border-amber-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-amber-600 text-white py-4 px-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold">🔴 PRACTICE C – Multiple Choice</h2>
            <button onClick={() => toggleSection('practiceC')} className="ml-4 p-2 rounded-full hover:bg-amber-700">
              {sections.practiceC ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
            </button>
          </div>
          {sections.practiceC && (
            <div className="p-8 grid md:grid-cols-2 gap-5">
              {practiceCExercises.map((ex) => (
                <div key={ex.key} className="bg-white p-5 rounded-xl shadow border border-amber-200">
                  <p className="font-medium mb-3">{ex.question}</p>
                  <div className="space-y-1">
                    {ex.options.map((opt, idx) => (
                      <label key={idx} className="flex items-center gap-2 text-sm">
                        <input type="radio" name={ex.key} value={opt} onChange={(e) => handleWrittenChange(ex.key, e.target.value)} /> {opt}
                      </label>
                    ))}
                  </div>
                  <button onClick={() => handleCheck(ex.key, writtenAnswers[ex.key] || "", ex.correct)} className="mt-3 bg-amber-500 text-white px-4 py-1 rounded text-sm">Check</button>
                  {showAnswerResults[ex.key] && <AnswerResult isCorrect={answerResults[ex.key]} correctAnswer={ex.correct} />}
                  <div className="answer-hidden-tag bg-yellow-100 p-1 rounded text-xs mt-2">🔒 RESPOSTA: {ex.correct}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ========== SPEAKING OUTPUT ========== */}
        <div className="bg-teal-50 border-2 border-teal-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-teal-600 text-white py-4 px-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold">🟣 SPEAKING (OUTPUT) – Describe a place you visited</h2>
            <button onClick={() => toggleSection('speaking')} className="ml-4 p-2 rounded-full hover:bg-teal-700">
              {sections.speaking ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
            </button>
          </div>
          {sections.speaking && (
            <div className="p-8">
              <p className="mb-4">Use: <strong>There was / There were / There wasn't / There weren't</strong>. Example: <em>There was a restaurant near my house. There were many people. There wasn't any music. There weren't enough tables.</em></p>
              <textarea rows={6} className="w-full p-4 border rounded-2xl" placeholder="Tell about a place you visited..." value={speakingOutput} onChange={(e) => setSpeakingOutput(e.target.value)} />
            </div>
          )}
        </div>

        {/* SAVE & NAVIGATION */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-8 pt-6 border-t-2 border-gray-200">
          <div className="flex gap-4">
            <button onClick={saveAllAnswers} className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full">💾 Save All Answers</button>
            <button onClick={clearAllAnswers} className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-full">Clear All</button>
          </div>
          <div className="flex gap-4">
            <button onClick={() => router.push("/cursos/lesson49")} className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-8 rounded-full">← Previous Lesson</button>
            <button onClick={() => router.push("/cursos/lesson51")} className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-8 rounded-full">Next Lesson →</button>
          </div>
        </div>

        <div className="mt-10 text-center text-gray-500 text-sm">
          <p>Lesson 50 – Clothes, Descriptions & There Was/Were | Describe people · Talk about the past</p>
          <p className="mt-1">© 2025 - English Learning Platform</p>
        </div>
      </div>
    </div>
  );
}