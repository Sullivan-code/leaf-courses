"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { HomeIcon, ArrowLeftIcon } from "lucide-react";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] grid place-items-center px-4 bg-[#FFFFFF] text-[#1D5C4A]">
      <Card className="w-full max-w-md border border-[#E5E5E5] bg-[#FFFFFF] shadow-xl">
        <CardContent className="pt-6">
          <div className="text-center space-y-6">
            {/* LARGE 404 TEXT */}
            <motion.p 
              className="text-8xl font-bold text-[#1D5C4A] font-mono drop-shadow-[0_0_4px_#C4E3DC]"
              animate={{
                scale: [1, 1.05, 1],
                opacity: [0.9, 1, 0.9]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              404
            </motion.p>

            {/* MESSAGE */}
            <div className="space-y-2">
              <h1 className="text-2xl font-bold tracking-tight">Usuário não encontrado</h1>
              <p className="text-[#444444]">O usuário que você está procurando não existe.</p>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <motion.div whileHover={{ scale: 1.05 }}>
                <Button 
                  variant="default" 
                  asChild
                  className="relative overflow-hidden group bg-[#C4E3DC] hover:bg-[#9BC6BA] text-[#1D5C4A]"
                >
                  <Link href="/">
                    <span className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                    <HomeIcon className="mr-2 size-4" />
                    Voltar para o Início
                  </Link>
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }}>
                <Button 
                  variant="outline" 
                  asChild
                  className="relative overflow-hidden group border border-[#C4E3DC] text-[#1D5C4A] hover:bg-[#C4E3DC] hover:text-[#1D5C4A]"
                >
                  <Link href="/">
                    <span className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                    <ArrowLeftIcon className="mr-2 size-4" />
                    Página Inicial
                  </Link>
                </Button>
              </motion.div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
