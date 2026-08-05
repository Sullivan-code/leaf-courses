"use client";

import React, { useState, useEffect } from 'react';
import { useChat } from '@/hooks/useChat';
import { useVoice } from '@/hooks/useVoice';
import { useAudio } from '@/hooks/useAudio';
import { ChatSidebar } from '@/components/ChatSidebar';
import { ChatMessages } from '@/components/ChatMessages';
import { MessageInput } from '@/components/MessageInput';
import VoiceRecorder from '@/components/VoiceRecorder';
import AudioPlayer from '@/components/AudioPlayer';
import { useUser } from '@clerk/nextjs';

export default function AssistantPage() {
  const { user, isLoaded } = useUser();
  const [conversations, setConversations] = useState([]);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Hooks do chat
  const {
    messages,
    isLoading: isChatLoading,
    currentConversationId,
    sendMessage,
    clearHistory,
    loadConversation,
  } = useChat();

  // Hook de voz
  const {
    isRecording,
    isProcessing,
    recordingDuration,
    startRecording,
    stopRecording,
    cancelRecording,
    formatDuration,
  } = useVoice({
    onTranscriptionComplete: async (text) => {
      if (text.trim()) {
        console.log('🎤 Transcrição:', text);
        // Envia a mensagem transcrita
        const result = await sendMessage(text);
        // Gera áudio da resposta
        if (result?.content) {
          generateAudioResponse(result.content);
        }
      }
    },
  });

  // Hook de áudio
  const {
    isPlaying,
    volume,
    playAudio,
    pauseAudio,
    stopAudio,
    setAudioVolume,
  } = useAudio({
    autoPlay: true,
    onEnd: () => {
      console.log('Audio finished playing');
    },
  });

  // Carrega conversas do usuário
  useEffect(() => {
    if (user) {
      loadConversations();
    }
  }, [user]);

  const loadConversations = async () => {
    try {
      const response = await fetch('/api/history');
      if (response.ok) {
        const data = await response.json();
        setConversations(data);
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
    }
  };

  // Função para gerar áudio da resposta
  const generateAudioResponse = async (text: string) => {
    if (!text) return;
    
    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.audioUrl) {
          setAudioUrl(data.audioUrl);
          playAudio(data.audioUrl);
        }
      }
    } catch (error) {
      console.error('Error generating audio:', error);
    }
  };

  // Envia mensagem de texto
  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;
    
    console.log('📨 Enviando mensagem:', text);
    
    try {
      const result = await sendMessage(text);
      if (result?.content) {
        generateAudioResponse(result.content);
      }
    } catch (error) {
      console.error('❌ Erro ao enviar mensagem:', error);
    }
  };

  // Nova conversa
  const handleNewConversation = () => {
    clearHistory();
    setAudioUrl(null);
    stopAudio();
    loadConversations();
  };

  // Selecionar conversa
  const handleSelectConversation = async (id: string) => {
    await loadConversation(id);
    setAudioUrl(null);
    stopAudio();
  };

  // Deletar conversa
  const handleDeleteConversation = async (id: string) => {
    try {
      const response = await fetch(`/api/history?conversationId=${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setConversations(prev => prev.filter((c: any) => c.id !== id));
        if (currentConversationId === id) {
          clearHistory();
        }
        await loadConversations();
      }
    } catch (error) {
      console.error('Error deleting conversation:', error);
    }
  };

  // Toggle sidebar em mobile
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500 dark:text-gray-400">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Faça login para continuar
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Você precisa estar autenticado para usar o LEAF AI Assistant.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950 overflow-hidden">
      {/* Sidebar */}
      <ChatSidebar
        conversations={conversations}
        currentConversationId={currentConversationId}
        onSelectConversation={handleSelectConversation}
        onNewConversation={handleNewConversation}
        onDeleteConversation={handleDeleteConversation}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col ml-0 md:ml-80 transition-all duration-300">
        {/* Header */}
        <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 md:hidden">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
            LEAF AI Assistant
          </h1>
          <div className="w-10" />
        </header>

        {/* Chat Messages */}
        <ChatMessages
          messages={messages}
          isLoading={isChatLoading || isProcessing}
        />

        {/* Audio Player */}
        {audioUrl && (
          <div className="px-4 pb-2">
            <AudioPlayer
              audio={null}
              audioUrl={audioUrl}
              isPlaying={isPlaying}
              volume={volume}
              onPlay={() => playAudio(audioUrl)}
              onPause={pauseAudio}
              onStop={() => {
                stopAudio();
                setAudioUrl(null);
              }}
              onVolumeChange={setAudioVolume}
              autoPlay={true}
            />
          </div>
        )}

        {/* Message Input */}
        <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="container mx-auto max-w-4xl">
            <MessageInput
              onSend={handleSendMessage}
              onVoiceStart={startRecording}
              isVoiceRecording={isRecording}
              isLoading={isChatLoading || isProcessing}
              placeholder="Digite sua mensagem em inglês..."
            />
          </div>
        </div>
      </div>

      {/* Voice Recorder - Mostra quando está gravando */}
      <div className="fixed bottom-24 right-8 z-50">
        <VoiceRecorder
          isRecording={isRecording}
          isProcessing={isProcessing}
          recordingDuration={recordingDuration}
          onStartRecording={startRecording}
          onStopRecording={stopRecording}
          onCancelRecording={cancelRecording}
          formatDuration={formatDuration}
          className="shadow-2xl"
        />
      </div>

      {/* Loading Overlay */}
      {isProcessing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-sm w-full mx-4">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Processando áudio...
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                Aguarde enquanto transcrevemos sua mensagem
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}