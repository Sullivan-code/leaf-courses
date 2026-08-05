'use client';

import React from 'react';
import { Mic, Square, Loader, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VoiceRecorderProps {
  isRecording: boolean;
  isProcessing: boolean;
  recordingDuration?: number;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onCancelRecording?: () => void;
  className?: string;
  formatDuration?: (seconds: number) => string;
}

export default function VoiceRecorder({
  isRecording,
  isProcessing,
  recordingDuration = 0,
  onStartRecording,
  onStopRecording,
  onCancelRecording,
  className,
  formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  },
}: VoiceRecorderProps) {
  // Se não estiver gravando nem processando, mostra botão de microfone
  if (!isRecording && !isProcessing) {
    return (
      <button
        onClick={onStartRecording}
        className={cn(
          'p-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl',
          'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700',
          'text-white',
          className
        )}
        aria-label="Iniciar gravação"
      >
        <Mic className="w-6 h-6" />
      </button>
    );
  }

  // Se estiver processando, mostra loading
  if (isProcessing) {
    return (
      <button
        disabled
        className={cn(
          'p-4 rounded-full bg-gray-500 text-white opacity-50 cursor-not-allowed',
          className
        )}
        aria-label="Processando..."
      >
        <Loader className="w-6 h-6 animate-spin" />
      </button>
    );
  }

  // Se estiver gravando, mostra botão de parar
  return (
    <div className="relative">
      <button
        onClick={onStopRecording}
        className={cn(
          'p-4 rounded-full transition-all duration-300 shadow-lg',
          'bg-red-500 hover:bg-red-600 animate-pulse',
          'text-white',
          className
        )}
        aria-label="Parar gravação"
      >
        <Square className="w-6 h-6" />
      </button>
      
      {/* Timer */}
      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
        <span className="text-xs font-mono text-red-500 bg-white dark:bg-gray-800 px-2 py-0.5 rounded-full shadow">
          {formatDuration(recordingDuration)}
        </span>
      </div>

      {/* Indicador de gravação */}
      <div className="absolute -top-1 -right-1">
        <span className="flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
        </span>
      </div>

      {/* Botão cancelar (opcional) */}
      {onCancelRecording && (
        <button
          onClick={onCancelRecording}
          className="absolute -top-2 -right-2 p-1 bg-gray-200 dark:bg-gray-700 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          aria-label="Cancelar gravação"
        >
          <X className="w-3 h-3 text-gray-600 dark:text-gray-300" />
        </button>
      )}
    </div>
  );
}