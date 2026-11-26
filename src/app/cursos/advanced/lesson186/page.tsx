// app/cursos/intermediate/lesson186/page.tsx
"use client";

import { useState, useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  Volume2,
  ChevronDown,
  ChevronUp,
  X,
} from "lucide-react";

// ============================================
// TYPES
// ============================================
type SectionKey =
  | "completeSentences"
  | "goingBeyond"
  | "pronunciation"
  | "thereAndAround";

interface NoteModalState {
  isOpen: boolean;
  sectionTitle: string;
  noteContent: string;
}

// ============================================
// IMAGES
// ============================================
const HERO_IMAGE =
  "https://images.pexels.com/photos/4050315/pexels-photo-4050315.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";

const BACKGROUND =
  "https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=1920&q=80";

const VIDEO_CALL_IMAGE =
  "https://images.pexels.com/photos/4226140/pexels-photo-4226140.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";

// ============================================
// SPEECH SYSTEM (American Female Voice)
// ============================================
const speakEnglish = (text: string, rate = 0.9) => {
  if (!text || typeof window === "undefined") return;
  if (!window.speechSynthesis) return;

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = rate;
  utterance.pitch = 1.0;

  const voices = window.speechSynthesis.getVoices();
  const americanFemale = voices.find(
    (v) =>
      (v.lang === "en-US" || v.lang.startsWith("en-US")) &&
      (v.name.toLowerCase().includes("samantha") ||
        v.name.toLowerCase().includes("google us english") ||
        v.name.toLowerCase().includes("siri") ||
        v.name.toLowerCase().includes("female") ||
        v.name === "Google US English" ||
        v.name === "Samantha")
  );
  const american = voices.find(
    (v) => v.lang === "en-US" || v.lang.startsWith("en-US")
  );
  if (americanFemale) utterance.voice = americanFemale;
  else if (american) utterance.voice = american;

  window.speechSynthesis.speak(utterance);
};

// ============================================
// SPEAK BUTTON
// ============================================
const SpeakBtn = ({
  text,
  speech,
  children,
  className = "",
  rate = 0.9,
}: {
  text: string;
  speech?: string;
  children?: ReactNode;
  className?: string;
  rate?: number;
}) => (
  <button
    type="button"
    onClick={(e) => {
      e.stopPropagation();
      speakEnglish(speech || text, rate);
    }}
    className={`inline-flex items-center gap-1 cursor-pointer hover:bg-amber-100 px-1 rounded transition-colors group text-left ${className}`}
    title="Click to hear American pronunciation"
  >
    <span className="flex-1">{children ?? text}</span>
    <Volume2
      size={12}
      className="opacity-0 group-hover:opacity-100 transition-opacity text-amber-600 flex-shrink-0"
    />
  </button>
);

// ============================================
// PENCIL ICON
// ============================================
function PencilIcon({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="ml-3 text-amber-200 hover:text-white transition-colors focus:outline-none"
      aria-label="Make notes"
      title="Click to make notes"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
      </svg>
    </button>
  );
}

// ============================================
// NOTE MODAL
// ============================================
function NoteModal({
  isOpen,
  onClose,
  sectionTitle,
  initialNote,
  onSave,
}: {
  isOpen: boolean;
  onClose: () => void;
  sectionTitle: string;
  initialNote: string;
  onSave: (note: string) => void;
}) {
  const [note, setNote] = useState(initialNote);

  useEffect(() => {
    setNote(initialNote);
  }, [initialNote, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(note);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-[70]"
      style={{ animation: "fadeIn 0.3s ease-out" }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-red-800 via-red-700 to-amber-700 text-white py-4 px-6">
          <h3 className="text-xl font-bold">📝 Notes – {sectionTitle}</h3>
          <p className="text-sm text-amber-100 mt-1">
            Write your observations, questions, or translations.
          </p>
        </div>
        <div className="p-6">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Write your notes here..."
            className="w-full h-64 p-4 border border-amber-300 rounded-xl focus:border-red-700 focus:outline-none focus:ring-2 focus:ring-amber-300 resize-none text-gray-800"
          />
        </div>
        <div className="flex justify-end gap-3 p-6 pt-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-red-800 hover:text-red-900 transition-colors font-semibold"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2 bg-gradient-to-r from-red-800 to-amber-700 text-white rounded-full hover:from-red-900 hover:to-amber-800 transition-all duration-300 font-semibold"
          >
            Save Note
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================
// SECTION WRAPPER
// ============================================
function Section({
  id,
  title,
  icon,
  open,
  onToggle,
  onOpenNote,
  children,
}: {
  id: string;
  title: string;
  icon: string;
  open: boolean;
  onToggle: () => void;
  onOpenNote: () => void;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className="mb-8 border-2 border-amber-300 bg-gradient-to-br from-red-50 via-amber-50 to-amber-100 rounded-3xl shadow-lg relative"
    >
      <div className="w-full bg-gradient-to-r from-red-800 via-red-700 to-amber-700 text-amber-50 py-4 px-6 flex items-center justify-between rounded-t-3xl">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggle}
            className="flex items-center gap-2 hover:opacity-90 transition-opacity"
          >
            <span>{icon}</span>
            <span className="text-xl md:text-2xl font-bold text-left">
              {title}
            </span>
          </button>
          <PencilIcon onClick={onOpenNote} />
        </div>
        <button
          type="button"
          onClick={onToggle}
          className="hover:opacity-80 transition-opacity"
          aria-label={open ? "Collapse section" : "Expand section"}
        >
          {open ? <ChevronUp size={22} /> : <ChevronDown size={22} />}
        </button>
      </div>

      {open && (
        <div className="p-5 md:p-7" style={{ animation: "fadeIn 0.25s ease-out" }}>
          {children}
        </div>
      )}
    </section>
  );
}

// ============================================
// DATA
// ============================================
const COMPLETE_SENTENCES = [
  { id: "a", prompt: "Digital influencers frequently seek..." },
  { id: "b", prompt: "Social media should warn..." },
  { id: "c", prompt: "It is important to keep up with..." },
  { id: "d", prompt: "Digital influencers should..." },
  { id: "e", prompt: "We must warn..." },
];

const GOING_BEYOND_TEXTS = [
  {
    source: "The Independent",
    title: "Three in four Americans overestimate their ability to spot false news stories, study finds",
    text: "A recent study reveals that a significant majority of Americans believe they can easily identify fake news, yet when tested, many fail to distinguish between factual reporting and fabricated stories. This overconfidence makes them more vulnerable to misinformation, highlighting a critical gap in media literacy and the urgent need for better educational tools to help the public navigate the complex information landscape. The study also finds Republicans are more likely to fall for fake news than Democrats.",
    reference: "Source: https://www.independent.co.uk/news/world/americas/fake-news-america-republicans-democrats-study-ability-spot-b1873488.html (Accessed on June 9, 2021)"
  },
  {
    source: "Knowledge@Wharton",
    title: "From facts to fake news: How information gets distorted",
    text: "As information travels farther away from its original source, retailers tend to select facts, offer their own interpretations, and lean toward the negative, according to the study. This phenomenon, often driven by algorithms and the desire for clicks, transforms objective facts into heavily skewed narratives. Understanding this distortion is essential for consumers who must learn to trace information back to its origins to verify its authenticity.",
    reference: "Source: https://knowledge.wharton.upenn.edu/article/from-facts-to-fake-news-how-information-gets-distorted/ (Accessed on June 9, 2021)"
  }
];

const PRONUNCIATION_SENTENCES = [
  { id: "a", text: "He helped to get the scoop and picked the headline for the story." },
  { id: "b", text: "My father watched the news coverage about the scandal and then talked about it all day." },
  { id: "c", text: "From my point of view, the story was covered well, but it conveyed a biased message." },
  { id: "d", text: "Haven't I warned you about not reading any anonymous source? Who convinced you I was wrong?" },
  { id: "e", text: "I suggested we check the source first, but someone insisted we didn't have to." },
];

// ============================================
// MAIN COMPONENT
// ============================================
export default function Lesson186AlternativeSources() {
  const router = useRouter();

  const [openSections, setOpenSections] = useState<Record<SectionKey, boolean>>({
    completeSentences: true,
    goingBeyond: true,
    pronunciation: true,
    thereAndAround: true,
  });

  const [noteModal, setNoteModal] = useState<NoteModalState>({
    isOpen: false,
    sectionTitle: "",
    noteContent: "",
  });
  const [savedNotes, setSavedNotes] = useState<Record<string, string>>({});

  // State for the sentences exercise
  const [sentenceAnswers, setSentenceAnswers] = useState<Record<string, string>>({});
  const [thereAndAroundText, setThereAndAroundText] = useState("");

  const [isHeroModalOpen, setIsHeroModalOpen] = useState(false);
  const [isVideoCallModalOpen, setIsVideoCallModalOpen] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("lesson186_notes");
      if (saved) setSavedNotes(JSON.parse(saved));

      const savedSentences = localStorage.getItem("lesson186_sentences");
      if (savedSentences) setSentenceAnswers(JSON.parse(savedSentences));

      const savedThere = localStorage.getItem("lesson186_there_and_around");
      if (savedThere) setThereAndAroundText(savedThere);
    } catch (err) {
      console.warn("Could not load saved data:", err);
    }
    if (typeof window !== "undefined") window.speechSynthesis?.getVoices();
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("lesson186_notes", JSON.stringify(savedNotes));
    } catch (err) {
      console.warn("Could not save notes:", err);
    }
  }, [savedNotes]);

  useEffect(() => {
    try {
      localStorage.setItem("lesson186_sentences", JSON.stringify(sentenceAnswers));
    } catch (err) {
      console.warn("Could not save sentences:", err);
    }
  }, [sentenceAnswers]);

  useEffect(() => {
    try {
      localStorage.setItem("lesson186_there_and_around", thereAndAroundText);
    } catch (err) {
      console.warn("Could not save there and around text:", err);
    }
  }, [thereAndAroundText]);

  const toggleSection = (key: SectionKey) =>
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));

  const openNoteModal = (sectionTitle: string) => {
    setNoteModal({
      isOpen: true,
      sectionTitle,
      noteContent: savedNotes[sectionTitle] || "",
    });
  };

  const saveNote = (note: string) => {
    setSavedNotes((prev) => ({ ...prev, [noteModal.sectionTitle]: note }));
  };

  const handleSentenceChange = (id: string, value: string) => {
    setSentenceAnswers((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <div
      className="min-h-screen py-8 md:py-16 px-4 md:px-6"
      style={{
        backgroundImage: `linear-gradient(rgba(120, 20, 20, 0.55), rgba(120, 20, 20, 0.55)), url("${BACKGROUND}")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="max-w-5xl mx-auto bg-white/95 backdrop-blur-sm rounded-[40px] shadow-2xl p-6 md:p-10 border-4 border-amber-500/40">
        {/* ===================== HERO ===================== */}
        <div className="mb-10">
          <div
            className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-amber-600/60 group cursor-pointer"
            onClick={() => setIsHeroModalOpen(true)}
            title="Click to enlarge"
          >
            <img
              src={HERO_IMAGE}
              alt="Lesson 186 – Alternative Sources"
              className="w-full max-h-[480px] object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-red-950/80 via-red-900/20 to-transparent flex items-end p-6 md:p-8">
              <div>
                <div className="inline-block px-3 py-1 rounded-full bg-amber-500 text-red-950 text-xs font-extrabold tracking-wider mb-3 shadow">
                  LESSON 186
                </div>
                <h1 className="text-3xl md:text-5xl font-extrabold text-amber-50 drop-shadow-lg">
                  📰 Alternative Sources & Fake News
                </h1>
                <p className="text-amber-100 text-sm md:text-base mt-2 max-w-2xl">
                  Media Literacy, Information Distortion & Pronunciation
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ===================== 1. COMPLETE THE SENTENCES ===================== */}
        <Section
          id="completeSentences"
          title="COMPLETE THE SENTENCES"
          icon="✍️"
          open={openSections.completeSentences}
          onToggle={() => toggleSection("completeSentences")}
          onOpenNote={() => openNoteModal("Complete the Sentences")}
        >
          <div className="bg-white p-5 rounded-xl border border-amber-300 shadow-sm mb-4">
            <p className="text-lg font-semibold text-red-900 mb-4 bg-amber-100 p-3 rounded-lg inline-block">
              <SpeakBtn text="We should filter out information we read before sharing with others.">
                We should filter out information we read before sharing with others.
              </SpeakBtn>
            </p>
            <div className="space-y-4">
              {COMPLETE_SENTENCES.map((item) => (
                <div key={item.id} className="flex flex-col md:flex-row gap-2 items-start">
                  <span className="font-bold text-red-700 mt-2">{item.id}.</span>
                  <div className="flex-1 w-full">
                    <p className="text-gray-800 mb-1 font-medium">{item.prompt}</p>
                    <textarea
                      value={sentenceAnswers[item.id] || ""}
                      onChange={(e) => handleSentenceChange(item.id, e.target.value)}
                      placeholder="Complete the sentence here..."
                      className="w-full p-3 text-sm rounded-lg border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-y text-gray-800"
                      rows={2}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* ===================== 2. GOING BEYOND ===================== */}
        <Section
          id="goingBeyond"
          title="GOING BEYOND"
          icon="🌐"
          open={openSections.goingBeyond}
          onToggle={() => toggleSection("goingBeyond")}
          onOpenNote={() => openNoteModal("Going Beyond")}
        >
          <div className="text-center mb-6">
            <h4 className="text-lg font-extrabold text-red-900 tracking-wide uppercase">
              Alternative Sources of Information and the Danger of Fake News
            </h4>
          </div>

          <div className="space-y-6">
            {GOING_BEYOND_TEXTS.map((text, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-amber-300 shadow-sm overflow-hidden flex flex-col md:flex-row">
                {/* Visual side */}
                <div className="bg-red-800 p-6 flex flex-col items-center justify-center md:w-1/3 text-white">
                  <div className="text-4xl mb-2">{idx === 0 ? "📰" : "🧠"}</div>
                  <h5 className="text-center font-bold text-lg leading-tight">{text.source}</h5>
                </div>
                {/* Text side */}
                <div className="p-5 md:p-6 md:w-2/3">
                  <h3 className="font-bold text-red-900 text-lg mb-3">
                    {text.title}
                  </h3>
                  <p className="text-gray-700 leading-relaxed text-sm md:text-base mb-4">
                    {text.text}
                  </p>
                  <div className="border-t border-dashed border-amber-300 pt-3">
                    <p className="text-xs text-gray-500 italic break-words">
                      {text.reference}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* ===================== 3. PRONUNCIATION AND INTONATION ===================== */}
        <Section
          id="pronunciation"
          title="PRONUNCIATION AND INTONATION"
          icon="🗣️"
          open={openSections.pronunciation}
          onToggle={() => toggleSection("pronunciation")}
          onOpenNote={() => openNoteModal("Pronunciation and Intonation")}
        >
          <p className="text-red-700 italic mb-4">
            <SpeakBtn text="Click on each sentence to hear the pronunciation and intonation.">
              🎧 Click on each sentence to hear the pronunciation and intonation.
            </SpeakBtn>
          </p>
          
          <div className="grid grid-cols-1 gap-3 mb-6">
            {PRONUNCIATION_SENTENCES.map((s) => (
              <div key={s.id} className="bg-white p-4 rounded-xl border border-amber-300 shadow-sm flex gap-3 items-start">
                <span className="font-bold text-red-700">{s.id}.</span>
                <SpeakBtn text={s.text} className="text-gray-800 text-lg flex-1">
                  {s.text}
                </SpeakBtn>
              </div>
            ))}
          </div>

          {/* Speech Bubble Highlight */}
          <div className="flex justify-end mt-4">
            <div className="bg-gradient-to-r from-red-100 to-amber-100 border-2 border-red-300 p-4 rounded-2xl rounded-tr-none shadow-md max-w-md relative">
              <div className="absolute -top-3 -right-3 bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg shadow">
                💬
              </div>
              <SpeakBtn text="Someone suggested we remembered the difference between truth and opinion." className="text-red-900 font-medium italic text-lg">
                "Someone suggested we remembered the difference between truth and opinion."
              </SpeakBtn>
            </div>
          </div>
        </Section>

        {/* ===================== 4. THERE AND AROUND ===================== */}
        <Section
          id="thereAndAround"
          title="THERE AND AROUND"
          icon="📍"
          open={openSections.thereAndAround}
          onToggle={() => toggleSection("thereAndAround")}
          onOpenNote={() => openNoteModal("There and Around")}
        >
          <div className="bg-white rounded-2xl border border-amber-300 shadow-sm p-6">
            <div className="mb-4">
              <div
                className="relative rounded-xl overflow-hidden shadow-lg border-2 border-amber-400 group cursor-pointer"
                onClick={() => setIsVideoCallModalOpen(true)}
                title="Click to enlarge"
              >
                <img
                  src={VIDEO_CALL_IMAGE}
                  alt="Video Call"
                  className="w-full max-h-[300px] object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
              </div>
            </div>
            
            <h4 className="font-bold text-red-900 text-lg mb-2">
              🎥 Describe the scene & practice your speaking.
            </h4>
            <p className="text-gray-600 mb-4 text-sm">
              Look at the image above. Imagine you are participating in this online meeting. 
              Write a short paragraph describing what is happening, what they might be discussing (perhaps about alternative sources or fake news), and your own opinion on the topic.
            </p>
            
            <textarea
              value={thereAndAroundText}
              onChange={(e) => setThereAndAroundText(e.target.value)}
              placeholder="Type your paragraph here..."
              className="w-full h-40 p-4 text-base rounded-xl border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-y text-gray-800"
            />
          </div>
        </Section>

        {/* ===================== NAVIGATION ===================== */}
        <div className="flex justify-center gap-4 mt-8 flex-wrap">
          <button
            type="button"
            onClick={() => router.push("/cursos/intermediate/lesson185")}
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-8 rounded-full transition-colors"
          >
            ← Previous Lesson (185)
          </button>
          <button
            type="button"
            onClick={() => router.push("/cursos/intermediate/lesson187")}
            className="bg-gradient-to-r from-red-800 to-amber-700 hover:from-red-900 hover:to-amber-800 text-white font-semibold py-3 px-8 rounded-full transition-all"
          >
            Next Lesson (187) →
          </button>
        </div>
      </div>

      {/* ===================== FLOATING NOTE BUTTON ===================== */}
      <button
        type="button"
        onClick={() => openNoteModal("General Notes")}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-red-800 to-amber-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl hover:from-red-900 hover:to-amber-800 transition-all duration-300 z-50 flex items-center justify-center"
        title="Make general notes"
        aria-label="Make general notes"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
        </svg>
      </button>

      {/* ===================== IMAGE MODALS ===================== */}
      {isHeroModalOpen && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={() => setIsHeroModalOpen(false)}
        >
          <div className="relative max-w-5xl max-h-full p-4">
            <img
              src={HERO_IMAGE}
              alt="Hero – enlarged"
              className="max-w-full max-h-screen object-contain rounded-lg shadow-2xl"
            />
            <button
              type="button"
              onClick={() => setIsHeroModalOpen(false)}
              className="absolute top-4 right-6 text-white text-4xl font-bold hover:text-gray-300 transition-colors"
              aria-label="Close"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {isVideoCallModalOpen && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={() => setIsVideoCallModalOpen(false)}
        >
          <div className="relative max-w-5xl max-h-full p-4">
            <img
              src={VIDEO_CALL_IMAGE}
              alt="Video Call – enlarged"
              className="max-w-full max-h-screen object-contain rounded-lg shadow-2xl"
            />
            <button
              type="button"
              onClick={() => setIsVideoCallModalOpen(false)}
              className="absolute top-4 right-6 text-white text-4xl font-bold hover:text-gray-300 transition-colors"
              aria-label="Close"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* ===================== NOTE MODAL ===================== */}
      <NoteModal
        isOpen={noteModal.isOpen}
        onClose={() => setNoteModal((prev) => ({ ...prev, isOpen: false }))}
        sectionTitle={noteModal.sectionTitle}
        initialNote={noteModal.noteContent}
        onSave={saveNote}
      />

      <style jsx global>{`
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
      `}</style>
    </div>
  );
}