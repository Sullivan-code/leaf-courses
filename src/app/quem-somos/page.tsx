"use client"

import React from 'react';
import { motion } from "framer-motion";

const QuemSomos: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 font-sans text-gray-800">
      <motion.h1
        className="text-6xl font-bold mb-6 text-center"
        initial={{ scale: 1 }}
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        style={{
          backgroundImage:
            "linear-gradient(90deg, #FFDDC1, #FFAAAA, #D4A5FF, #A0C4FF, #B5EAD7)",
          WebkitBackgroundClip: "text",
          color: "transparent",
        }}
      >
        Quem Somos
      </motion.h1>
      
      <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
        <p className="text-lg mb-6 text-gray-700 leading-relaxed">
          Somos uma escola de inglês especializada em preparar estudantes para <strong>intercâmbios internacionais</strong>, 
          desenvolvimento <strong>cultural</strong>, <strong>fluência linguística</strong> e <strong>profissionalização</strong> 
          com idiomas para o mercado de trabalho nacional e internacional.
        </p>
        
        <p className="text-lg mb-6 text-gray-700 leading-relaxed">
          Nossa missão é transformar vidas através do domínio do inglês, oferecendo uma educação de excelência que 
          combina metodologia inovadora, experiências culturais autênticas e preparação profissional para os desafios 
          do mercado global.
        </p>

        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="text-xl font-bold text-blue-800 mb-3">🎯 Nossa Abordagem</h3>
            <ul className="space-y-2 text-blue-700">
              <li>• Preparação para intercâmbios culturais</li>
              <li>• Desenvolvimento de fluência autêntica</li>
              <li>• Foco no mercado de trabalho global</li>
              <li>• Imersão cultural internacional</li>
            </ul>
          </div>

          <div className="bg-green-50 p-6 rounded-lg">
            <h3 className="text-xl font-bold text-green-800 mb-3">💼 Diferenciais Profissionais</h3>
            <ul className="space-y-2 text-green-700">
              <li>• Inglês para negócios e carreiras</li>
              <li>• Preparação para entrevistas internacionais</li>
              <li>• Desenvolvimento de networking global</li>
              <li>• Certificações reconhecidas mundialmente</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg p-8 text-white mb-8">
        <h2 className="text-3xl font-bold mb-4 text-center">🌍 Nossa Equipe Internacional</h2>
        <p className="text-lg text-center mb-6">
          Contamos com professores nativos e brasileiros altamente qualificados, com experiência 
          em intercâmbios e mercado internacional
        </p>
        
        <div className="grid md:grid-cols-3 gap-4 text-center">
          <div className="bg-white bg-opacity-20 p-4 rounded-lg">
            <h4 className="font-bold text-lg">Professores Nativos</h4>
            <p className="text-sm">Experiência internacional e cultural</p>
          </div>
          <div className="bg-white bg-opacity-20 p-4 rounded-lg">
            <h4 className="font-bold text-lg">Especialistas em Carreira</h4>
            <p className="text-sm">Preparação para o mercado global</p>
          </div>
          <div className="bg-white bg-opacity-20 p-4 rounded-lg">
            <h4 className="font-bold text-lg">Consultores de Intercâmbio</h4>
            <p className="text-sm">Orientação para estudos no exterior</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-6 text-blue-800 text-center">🚀 Nossos Pilares Educacionais</h2>
        
        <div className="space-y-6">
          <div className="flex items-start">
            <div className="bg-yellow-100 p-3 rounded-full mr-4">
              <span className="text-2xl">🌎</span>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Intercâmbio Cultural</h3>
              <p className="text-gray-700">
                Preparamos estudantes para experiências internacionais, desenvolvendo competências 
                interculturais e adaptação a diferentes contextos globais.
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="bg-green-100 p-3 rounded-full mr-4">
              <span className="text-2xl">🗣️</span>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Fluência Linguística</h3>
              <p className="text-gray-700">
                Desenvolvemos comunicação autêntica e natural em inglês, com foco em pronúncia, 
                vocabulário avançado e expressões do dia a dia.
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="bg-blue-100 p-3 rounded-full mr-4">
              <span className="text-2xl">💼</span>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Profissionalização</h3>
              <p className="text-gray-700">
                Preparamos para o mercado de trabalho global com inglês corporativo, terminologia 
                específica e habilidades para ambientes profissionais internacionais.
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="bg-purple-100 p-3 rounded-full mr-4">
              <span className="text-2xl">🎨</span>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Cultura Global</h3>
              <p className="text-gray-700">
                Integramos aspectos culturais de países anglófonos, proporcionando compreensão 
                aprofundada de diferentes realidades sociais e profissionais.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuemSomos;