'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, Paperclip } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MessageInputProps {
  onSend: (message: string) => void;
  onVoiceStart?: () => void;
  isVoiceRecording?: boolean;
  isLoading?: boolean;
  placeholder?: string;
}

export function MessageInput({
  onSend,
  onVoiceStart,
  isVoiceRecording = false,
  isLoading = false,
  placeholder = 'Digite sua mensagem...',
}: MessageInputProps) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSend(message.trim());
      setMessage('');
      adjustTextareaHeight();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [message]);

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-end gap-2 p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
    >
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onVoiceStart}
          disabled={isLoading}
          className={cn(
            'p-2 rounded-full transition-colors',
            isVoiceRecording
              ? 'bg-red-500 text-white animate-pulse'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200',
            isLoading && 'opacity-50 cursor-not-allowed'
          )}
          aria-label="Gravar voz"
        >
          <Mic className="w-5 h-5" />
        </button>
        <button
          type="button"
          disabled={isLoading}
          className="p-2 rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          aria-label="Anexar arquivo"
        >
          <Paperclip className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={isLoading}
          rows={1}
          className={cn(
            'w-full resize-none bg-transparent outline-none text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500',
            'min-h-[44px] max-h-[120px] py-2 px-3 rounded-lg',
            'border border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400',
            isLoading && 'opacity-50 cursor-not-allowed'
          )}
        />
      </div>

      <button
        type="submit"
        disabled={!message.trim() || isLoading}
        className={cn(
          'p-2 rounded-full transition-colors flex-shrink-0',
          message.trim() && !isLoading
            ? 'bg-blue-500 text-white hover:bg-blue-600'
            : 'bg-gray-200 text-gray-400 dark:bg-gray-700 dark:text-gray-500 cursor-not-allowed'
        )}
        aria-label="Enviar mensagem"
      >
        <Send className="w-5 h-5" />
      </button>
    </form>
  );
}