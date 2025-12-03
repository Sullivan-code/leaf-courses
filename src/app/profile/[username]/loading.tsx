"use client";

import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 bg-white">
      {/* Outer animated circle with gradient and glow */}
      <motion.div
        className="w-28 h-28 rounded-full flex items-center justify-center shadow-2xl"
        style={{
          background: "linear-gradient(135deg, #FF6B6B, #FFD93D, #6BCB77, #4D96FF, #843BFF)",
          backgroundSize: "300% 300%",
        }}
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 360],
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {/* Inner core circle */}
        <motion.div
          className="w-16 h-16 rounded-full bg-white shadow-inner"
          animate={{
            scale: [1, 0.9, 1],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.div>

      {/* Animated text */}
      <motion.p
        className="text-xl font-semibold text-[#1D5C4A] text-center px-4"
        animate={{
          opacity: [0.6, 1, 0.6],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
        }}
      >
        Carregando... Estamos preparando seu perfil!
      </motion.p>

      {/* Animated loading bar */}
      <motion.div
        className="w-40 h-2 rounded-full bg-gradient-to-r from-[#C4E3DC] to-[#9BC6BA]"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: [0, 1, 0] }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ transformOrigin: "left" }}
      />
    </div>
  );
}
