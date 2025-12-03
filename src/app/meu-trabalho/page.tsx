"use client"

import React from 'react';
import { motion } from "framer-motion";

const SobreMim: React.FC = () => {
  return (
    <div className="relative">
      {/* Background com imagem e overlay */}
      <div 
        className="fixed inset-0 w-full h-full bg-cover bg-center -z-10"
        style={{ backgroundImage: "url('/images/raphapsi.jpg')" }}
      >
        <div className="absolute inset-0 bg-[#FFFFFF]/90"></div>
      </div>

      <div className="max-w-4xl mx-auto p-6 font-sans text-gray-800 relative z-10">
        {/* Título principal com cor sólida */}
        <motion.h1
          className="text-6xl font-bold mb-6 text-center text-[#2A5C5A]"
          initial={{ scale: 1 }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          Transformação através da TCC
        </motion.h1>

        {/* Introdução com primeira imagem */}
        <div className="flex flex-col md:flex-row gap-8 items-center mb-16">
          <div className="md:w-1/2">
            <img 
              src="/images/rapha1.jpg" 
              alt="Raphael em sessão" 
              className="rounded-xl shadow-xl w-full h-auto max-h-96 object-cover"
            />
          </div>
          <div className="md:w-1/2">
            <h2 className="text-3xl font-bold mb-4 text-[#2A5C5A]">Minha Jornada com a Terapia Cognitivo-Comportamental</h2>
            <p className="text-lg mb-4 text-gray-700">
              Como psicólogo especializado em TCC, tenho o privilégio de guiar meus pacientes em uma jornada de autoconhecimento e mudança. 
              Cada sessão é uma oportunidade para desconstruir padrões limitantes e construir novas formas de pensar e agir.
            </p>
            <p className="text-lg text-gray-700">
              A TCC não é apenas uma terapia - é um mapa para uma vida mais leve e significativa. Através dela, ajudamos pessoas a 
              reescreverem suas histórias com final feliz.
            </p>
          </div>
        </div>

        {/* Caso 1 - Ansiedade */}
        <div className="bg-[#B2E3DC] rounded-xl p-8 shadow-lg border-2 border-[#A9D7D3] mb-16 relative overflow-hidden">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="md:w-1/2 order-2 md:order-1">
              <h2 className="text-3xl font-bold mb-4 text-[#2A5C5A]">Superando a Ansiedade</h2>
              <p className="text-lg mb-4 text-gray-700">
                Maria chegou ao consultório com crises de ansiedade que a impediam de trabalhar. Juntos, identificamos os 
                pensamentos catastróficos que disparavam sua ansiedade e desenvolvemos técnicas de enfrentamento.
              </p>
              <p className="text-lg mb-4 text-gray-700">
                Através de registros diários e exercícios de respiração, ela aprendeu a interromper o ciclo da ansiedade. 
                Hoje, Maria voltou a viajar de avião - algo que achava impossível há seis meses.
              </p>
              <div className="bg-white p-4 rounded-lg shadow-md">
                <p className="italic text-gray-700">"Aprendi que meus pensamentos não são fatos. Essa simples mudança de perspectiva mudou minha vida."</p>
              </div>
            </div>
            <div className="md:w-1/2 order-1 md:order-2">
              <img 
                src="/images/rapha2.jpg" 
                alt="Raphael trabalhando com ansiedade" 
                className="rounded-xl shadow-xl w-full h-auto max-h-96 object-cover"
              />
            </div>
          </div>
        </div>

        {/* Caso 2 - Depressão */}
        <div className="flex flex-col md:flex-row gap-8 items-center mb-16">
          <div className="md:w-1/2">
            <img 
              src="/images/rapha4.jpg" 
              alt="Raphael em workshop sobre depressão" 
              className="rounded-xl shadow-xl w-full h-auto max-h-96 object-cover"
            />
          </div>
          <div className="md:w-1/2">
            <h2 className="text-3xl font-bold mb-4 text-[#2A5C5A]">Reencontrando a Luz</h2>
            <p className="text-lg mb-4 text-gray-700">
              Carlos sofria de depressão há anos quando chegou ao consultório. A TCC nos permitiu trabalhar em duas frentes: 
              aumentar suas atividades prazerosas e desafiar suas crenças de desesperança.
            </p>
            <p className="text-lg mb-4 text-gray-700">
              Através do "experimento comportamental", Carlos redescobriu hobbies abandonados e reconstruiu sua rede social. 
              Seu diário de conquistas se tornou uma prova tangível de seu progresso.
            </p>
            <div className="bg-[#E8F5F4] p-4 rounded-lg shadow-md">
              <p className="italic text-gray-700">"Aos poucos, os dias cinzentos foram ganhando cor. Hoje me surpreendo planejando o futuro com esperança."</p>
            </div>
          </div>
        </div>

        {/* Caso 3 - Autoestima */}
        <div className="bg-[#B2E3DC] rounded-xl p-8 shadow-lg border-2 border-[#A9D7D3] mb-16">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold mb-4 text-[#2A5C5A]">Reconstruindo a Autoestima</h2>
              <p className="text-lg mb-4 text-gray-700">
                Ana sofria com uma autocrítica devastadora. Através da TCC, trabalhamos para identificar a origem desses 
                pensamentos e desenvolver autocompaixão.
              </p>
              <p className="text-lg mb-4 text-gray-700">
                Usamos técnicas como a "carta compassiva" e o "diálogo interno positivo". Ana aprendeu a tratar a si mesma 
                com a mesma gentileza que dedicava aos outros.
              </p>
              <div className="bg-white p-4 rounded-lg shadow-md">
                <p className="italic text-gray-700">"Finalmente me libertei da voz que me dizia que não era boa o suficiente. Me surpreendo gostando do que vejo no espelho."</p>
              </div>
            </div>
            <div className="md:w-1/2">
              <img 
                src="/images/rp9.jpg" 
                alt="Raphael trabalhando com autoestima" 
                className="rounded-xl shadow-xl w-full h-auto max-h-96 object-cover"
              />
            </div>
          </div>
        </div>

        {/* Caso 4 - Relacionamentos */}
        <div className="flex flex-col md:flex-row gap-8 items-center mb-16">
          <div className="md:w-1/2">
            <img 
              src="/images/rp10.jpg" 
              alt="Raphael em terapia de casal" 
              className="rounded-xl shadow-xl w-full h-auto max-h-96 object-cover"
            />
          </div>
          <div className="md:w-1/2">
            <h2 className="text-3xl font-bold mb-4 text-[#2A5C5A]">Conexões que Curam</h2>
            <p className="text-lg mb-4 text-gray-700">
              Juliana e Marcos estavam à beira da separação quando buscaram ajuda. Com a TCC para casais, trabalhamos 
              suas expectativas irreais e padrões de comunicação tóxicos.
            </p>
            <p className="text-lg mb-4 text-gray-700">
              Através de exercícios de escuta ativa e reestruturação cognitiva conjunta, redescobriram a conexão que os 
              uniu inicialmente. Hoje, celebram 3 anos da "segunda primeira vez".
            </p>
            <div className="bg-[#E8F5F4] p-4 rounded-lg shadow-md">
              <p className="italic text-gray-700">"Aprendemos que o amor não é mágica - é escolha diária. A terapia nos deu as ferramentas para fazer essa escolha."</p>
            </div>
          </div>
        </div>

        {/* Caso 5 - Estresse Pós-Traumático */}
        <div className="bg-[#B2E3DC] rounded-xl p-8 shadow-lg border-2 border-[#A9D7D3] mb-16">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold mb-4 text-[#2A5C5A]">Resgatando a Segurança</h2>
              <p className="text-lg mb-4 text-gray-700">
                Pedro sofria de TEPT após um acidente grave. Com a TCC, utilizamos técnicas de exposição gradual e 
                reestruturação cognitiva para processar o trauma.
              </p>
              <p className="text-lg mb-4 text-gray-700">
                Através da "dessensibilização sistemática", Pedro recuperou o controle sobre suas memórias. O que antes 
                era um gatilho paralisante, hoje é apenas um evento do passado.
              </p>
              <div className="bg-white p-4 rounded-lg shadow-md">
                <p className="italic text-gray-700">"Aprendi que não precisava esquecer, apenas processar. Hoje dirijo novamente, sem medo."</p>
              </div>
            </div>
            <div className="md:w-1/2">
              <img 
                src="/images/rp10.jpg" 
                alt="Raphael trabalhando com trauma" 
                className="rounded-xl shadow-xl w-full h-auto max-h-96 object-cover"
              />
            </div>
          </div>
        </div>

        {/* Caso 6 - Compulsão Alimentar */}
        <div className="flex flex-col md:flex-row gap-8 items-center mb-16">
          <div className="md:w-1/2">
            <img 
              src="/images/rp12.jpg" 
              alt="Raphael em sessão sobre hábitos" 
              className="rounded-xl shadow-xl w-full h-auto max-h-96 object-cover"
            />
          </div>
          <div className="md:w-1/2">
            <h2 className="text-3xl font-bold mb-4 text-[#2A5C5A]">Rompendo Ciclos</h2>
            <p className="text-lg mb-4 text-gray-700">
              Luiza lutava contra a compulsão alimentar há anos. Juntos, identificamos os pensamentos "tudo ou nada" que 
              perpetuavam o ciclo e desenvolvemos estratégias de enfrentamento.
            </p>
            <p className="text-lg mb-4 text-gray-700">
              Através do registro de padrões e da técnica de "adiamento da compulsão", Luiza recuperou o controle sobre 
              sua relação com a comida. Seu diário alimentar se transformou em um diário de vitórias.
            </p>
            <div className="bg-[#E8F5F4] p-4 rounded-lg shadow-md">
              <p className="italic text-gray-700">"Entendi que um deslize não é um fracasso. Essa mudança de mentalidade foi libertadora."</p>
            </div>
          </div>
        </div>

        {/* Caso 7 - Insônia */}
        <div className="bg-[#B2E3DC] rounded-xl p-8 shadow-lg border-2 border-[#A9D7D3] mb-16">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold mb-4 text-[#2A5C5A]">Noites de Paz</h2>
              <p className="text-lg mb-4 text-gray-700">
                Ricardo não dormia bem há décadas. Com a TCC para insônia, trabalhamos seus pensamentos catastróficos sobre 
                o sono e implementamos técnicas de higiene do sono.
              </p>
              <p className="text-lg mb-4 text-gray-700">
                Através do "controle de estímulos" e da "restrição de sono", Ricardo reconstruiu sua associação entre cama 
                e descanso. Hoje, seu maior problema é decidir qual travesseiro é mais confortável.
              </p>
              <div className="bg-white p-4 rounded-lg shadow-md">
                <p className="italic text-gray-700">"Aprendi que dormir não é uma competição. Quando parei de tentar, o sono veio naturalmente."</p>
              </div>
            </div>
            <div className="md:w-1/2">
              <img 
                src="/images/rapha4.jpg" 
                alt="Raphael trabalhando com insônia" 
                className="rounded-xl shadow-xl w-full h-auto max-h-96 object-cover"
              />
            </div>
          </div>
        </div>

        {/* Mensagem Final */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6 text-[#2A5C5A]">Cada Jornada é Única</h2>
          <p className="text-xl mb-8 text-gray-700 max-w-3xl mx-auto">
            Essas histórias mostram o poder transformador da TCC, mas sua jornada será tão única quanto você. 
            Estou aqui para ajudar você a escrever seu próprio final feliz.
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block"
          >
            <a 
              href="https://api.whatsapp.com/send?phone=5521992078455" 
              className="bg-[#2A5C5A] text-white px-8 py-4 rounded-lg shadow-lg font-bold text-lg hover:bg-[#1E4846] transition"
            >
              Comece Sua Transformação'
            </a>
          </motion.div>
        </div>

        {/* Contato */}
        <div id="contato" className="mt-12 bg-[#B2E3DC] rounded-xl p-8 shadow-lg border-2 border-[#A9D7D3]">
          <h2 className="text-3xl font-bold mb-6 text-center text-[#2A5C5A]">Vamos Conversar</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4 text-[#2A5C5A]">Informações de Contato</h3>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <svg className="w-6 h-6 mr-3 text-[#2A5C5A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  (21) 99207-8455
                </li>
                <li className="flex items-center">
                  <svg className="w-6 h-6 mr-3 text-[#2A5C5A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  raphaelalcantaradasilva@gmail.com
                </li>
                <li className="flex items-center">
                  <svg className="w-6 h-6 mr-3 text-[#2A5C5A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Atendimento presencial e online
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4 text-[#2A5C5A]">Horários</h3>
              <ul className="space-y-2">
                <li className="flex justify-between">
                  <span>Segunda a Sexta</span>
                  <span>8h às 19h</span>
                </li>
                <li className="flex justify-between">
                  <span>Sábado</span>
                  <span>9h às 13h</span>
                </li>
              </ul>
              <div className="mt-6">
                <a 
                  href="https://api.whatsapp.com/send?phone=5521992078455" 
                  className="inline-flex items-center bg-white px-6 py-3 rounded-lg shadow-md font-medium text-[#2A5C5A] hover:bg-[#E8F5F4] transition"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Agende pelo WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SobreMim;