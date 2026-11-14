"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, Check, XCircle, Volume2 } from "lucide-react";

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
// SPEAK RIGHT NOW - DESCRIBING PEOPLE (8 SITUATIONS)
// ============================================
const speakRightNowItems = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format",
    alt: "Person wearing a white T-shirt",
    description: "white T-shirt",
    pronoun: "He",
    example: "He is wearing a white T-shirt."
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=500&auto=format",
    alt: "Person wearing a dress",
    description: "dress",
    pronoun: "She",
    example: "She is wearing a dress."
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=500&auto=format",
    alt: "Person wearing a suit",
    description: "suit",
    pronoun: "He",
    example: "He is wearing a suit and a tie.",
    vocabulary: [{ word: "tie", translation: "gravata" }]
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=500&auto=format",
    alt: "Person wearing a black sweater and beanie",
    description: "black sweater",
    pronoun: "He",
    example: "He is wearing a black sweater and a beanie.",
    vocabulary: [{ word: "beanie", translation: "touca" }]
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=500&auto=format",
    alt: "Person wearing a white dress",
    description: "white dress",
    pronoun: "She",
    example: "She is wearing a white dress."
  },
  {
    id: 7,
    image: "https://images.unsplash.com/photo-1577221084712-45b0445d2b00?w=500&auto=format",
    alt: "Person wearing a gym outfit",
    description: "gym outfit",
    pronoun: "She",
    example: "She is wearing a gym outfit."
  },
  {
    id: 8,
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&auto=format",
    alt: "Person wearing a hoodie",
    description: "hoodie",
    pronoun: "He",
    example: "He is wearing a hoodie."
  },
  {
    id: 10,
    image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=500&auto=format",
    alt: "Person wearing a red dress",
    description: "red dress",
    pronoun: "She",
    example: "She is wearing a red dress."
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

      {/* QUESTIONS SECTION */}
      <div className="px-8 pb-8">
        <div className="bg-indigo-50 p-6 rounded-xl border-2 border-indigo-200">
          <h3 className="text-xl font-bold text-indigo-700 mb-4">❓ QUESTIONS – Was there / Were there?</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg border border-blue-200 shadow-sm">
              <p className="font-semibold text-blue-700 mb-2">Singular</p>
              <p className="text-gray-700"><strong>Was there</strong> a restaurant near your house?</p>
              <p className="text-gray-600 text-sm mt-1">✅ Yes, there was. &nbsp;|&nbsp; ❌ No, there wasn't.</p>
              <p className="text-gray-700 mt-2"><strong>Was there</strong> any water at the hotel?</p>
              <p className="text-gray-600 text-sm mt-1">✅ Yes, there was. &nbsp;|&nbsp; ❌ No, there wasn't.</p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-green-200 shadow-sm">
              <p className="font-semibold text-green-700 mb-2">Plural</p>
              <p className="text-gray-700"><strong>Were there</strong> many people at the party?</p>
              <p className="text-gray-600 text-sm mt-1">✅ Yes, there were. &nbsp;|&nbsp; ❌ No, there weren't.</p>
              <p className="text-gray-700 mt-2"><strong>Were there</strong> any chairs in the room?</p>
              <p className="text-gray-600 text-sm mt-1">✅ Yes, there were. &nbsp;|&nbsp; ❌ No, there weren't.</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-4 italic">💡 Notice: in questions, the verb comes BEFORE the word "there".</p>
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
    speaking: true,
    tuneIn: true
  });

  // Exercise states
  const [writtenAnswers, setWrittenAnswers] = useState<Record<string, string>>({});
  const [answerResults, setAnswerResults] = useState<Record<string, boolean>>({});
  const [showAnswerResults, setShowAnswerResults] = useState<Record<string, boolean>>({});
  const [personalAnswers, setPersonalAnswers] = useState<Record<number, string>>({});
  const [speakingOutput, setSpeakingOutput] = useState("");

  // Speak Right Now - user created sentences
  const [userSentences, setUserSentences] = useState<Record<number, string>>({
    1: "He's wearing a white T-shirt" // Pre-filled as requested
  });

  // Audio helper
  const speakWord = (text: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };

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
        setUserSentences(data.userSentences || { 1: "He's wearing a white T-shirt" });
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
      setUserSentences({ 1: "He's wearing a white T-shirt" });
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
              <h2 className="text-2xl font-bold">🎤 SPEAK RIGHT NOW – Describing Clothes</h2>
              <button onClick={() => toggleSection('speakRightNow')} className="ml-4 p-2 rounded-full hover:bg-pink-600">
                {sections.speakRightNow ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
          </div>
          {sections.speakRightNow && (
            <div className="p-8">
              <p className="text-gray-700 mb-6"><strong>💡 Model:</strong> <span className="bg-pink-100 px-3 py-1 rounded-full font-mono">He is wearing a white T-shirt.</span> Create your own sentences changing pronoun, color and clothing items.</p>
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
                      {item.vocabulary && item.vocabulary.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {item.vocabulary.map((v, idx) => (
                            <button
                              key={idx}
                              onClick={() => speakWord(v.word)}
                              className="inline-flex items-center gap-1 bg-purple-100 hover:bg-purple-200 text-purple-800 text-xs px-2 py-1 rounded-full transition"
                            >
                              <Volume2 size={14} /> {v.word} = {v.translation}
                            </button>
                          ))}
                        </div>
                      )}
                      <details className="mt-2">
                        <summary className="text-xs text-gray-400 cursor-pointer">✨ example</summary>
                        <p className="text-xs bg-gray-50 p-2 rounded mt-1">{item.example}</p>
                      </details>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 bg-yellow-50 p-4 rounded-xl border border-yellow-200">
                <p className="font-medium text-gray-700">✨ <strong>Your turn!</strong> Create a sentence for each image, changing pronoun (He/She/They), colors and clothing items. Use the 🔊 audio buttons to practice the vocabulary.</p>
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

                <p><strong>A –</strong> I don't believe it!! ______ a vending machine at the lobby?</p>
                <div className="flex gap-2"><input type="text" className="flex-1 border rounded p-2" value={writtenAnswers["pb-2"] || ""} onChange={(e) => handleWrittenChange("pb-2", e.target.value)} /><button onClick={() => handleCheck("pb-2", writtenAnswers["pb-2"] || "", "Was there")} className="bg-purple-500 text-white px-4 rounded">Check</button></div>
                {showAnswerResults["pb-2"] && <AnswerResult isCorrect={answerResults["pb-2"]} correctAnswer="Was there" />}

                <p><strong>B –</strong> Yes, ______. But ______ many people working that day so ______ anyone to fill the machine.</p>
                <div className="flex gap-2"><input type="text" className="flex-1 border rounded p-2" placeholder="answer1 / answer2 / answer3" value={writtenAnswers["pb-3"] || ""} onChange={(e) => handleWrittenChange("pb-3", e.target.value)} /><button onClick={() => handleCheck("pb-3", writtenAnswers["pb-3"] || "", "there was / there were / there wasn't")} className="bg-purple-500 text-white px-4 rounded">Check</button></div>
                {showAnswerResults["pb-3"] && <AnswerResult isCorrect={answerResults["pb-3"]} correctAnswer="there was / there were / there wasn't" />}

                <p><strong>A –</strong> Well, I'm sure ______ other people dealing with the same problem.</p>
                <div className="flex gap-2"><input type="text" className="flex-1 border rounded p-2" value={writtenAnswers["pb-4"] || ""} onChange={(e) => handleWrittenChange("pb-4", e.target.value)} /><button onClick={() => handleCheck("pb-4", writtenAnswers["pb-4"] || "", "there were")} className="bg-purple-500 text-white px-4 rounded">Check</button></div>
                {showAnswerResults["pb-4"] && <AnswerResult isCorrect={answerResults["pb-4"]} correctAnswer="there were" />}

                <p><strong>B –</strong> Yes, ______ many others complaining and ______ all the items available.</p>
                <div className="flex gap-2"><input type="text" className="flex-1 border rounded p-2" placeholder="there were / there weren't" value={writtenAnswers["pb-5"] || ""} onChange={(e) => handleWrittenChange("pb-5", e.target.value)} /><button onClick={() => handleCheck("pb-5", writtenAnswers["pb-5"] || "", "there were / there weren't")} className="bg-purple-500 text-white px-4 rounded">Check</button></div>
                {showAnswerResults["pb-5"] && <AnswerResult isCorrect={answerResults["pb-5"]} correctAnswer="there were / there weren't" />}
              </div>
            </div>
          )}
        </div>

        {/* ========== PRACTICE C ========== */}
        <div className="bg-amber-50 border-2 border-amber-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-amber-600 text-white py-4 px-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold">🔴 PRACTICE C – Multiple Choice (PAST TENSE)</h2>
            <button onClick={() => toggleSection('practiceC')} className="ml-4 p-2 rounded-full hover:bg-amber-700">
              {sections.practiceC ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
            </button>
          </div>
          {sections.practiceC && (
            <div className="p-8">
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
                <p className="text-red-800 font-medium">
                  ⚠️ <strong>Atenção:</strong> Este exercício é sobre o <strong>PASSADO</strong>. Algumas opções estão no <strong>presente</strong> (is, are, have, had) para te confundir! Leia o contexto e escolha a forma correta no passado.
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-5">
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
                  </div>
                ))}
              </div>
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

        {/* ========== TUNE IN YOUR EARS ========== */}
        <div className="bg-sky-50 border-2 border-sky-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-sky-600 text-white py-4 px-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold">🎧 TUNE IN YOUR EARS – Everyday English</h2>
            <button onClick={() => toggleSection('tuneIn')} className="ml-4 p-2 rounded-full hover:bg-sky-700">
              {sections.tuneIn ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
            </button>
          </div>
          {sections.tuneIn && (
            <div className="p-8">
              <p className="text-gray-700 mb-4">Listen to the text below. It's an everyday story (A2/B1 level) to help you practice your listening skills.</p>
              <div className="bg-white p-6 rounded-2xl shadow-md border border-sky-100">
                <p className="text-lg leading-relaxed text-gray-800 mb-6">
                  Last weekend, I went shopping with my sister because she needed a new outfit for a job interview. She wanted something professional but comfortable. First, we looked at some blouses, but they were too expensive. Then, she tried on a beautiful blue suit. It fit perfectly! However, there was a problem: there weren't any matching shoes in her size. We walked around the mall for an hour. Finally, we found a great pair of black flats on sale. She bought the suit and the shoes. There was a big smile on her face. Now, she feels confident and ready for her interview.
                </p>
                <button
                  onClick={() => speakWord("Last weekend, I went shopping with my sister because she needed a new outfit for a job interview. She wanted something professional but comfortable. First, we looked at some blouses, but they were too expensive. Then, she tried on a beautiful blue suit. It fit perfectly! However, there was a problem: there weren't any matching shoes in her size. We walked around the mall for an hour. Finally, we found a great pair of black flats on sale. She bought the suit and the shoes. There was a big smile on her face. Now, she feels confident and ready for her interview.")}
                  className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white px-6 py-3 rounded-full transition font-semibold shadow-md"
                >
                  <Volume2 size={20} /> Listen to the text
                </button>
              </div>
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