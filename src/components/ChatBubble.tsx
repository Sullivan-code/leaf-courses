'use client';

import React, { useState } from 'react';
import { Message } from '@/types/chat';
import { formatChatDate, cn } from '@/lib/utils';
import { Copy, Check, User, Bot } from 'lucide-react';

interface ChatBubbleProps {
  message: Message;
  isLast?: boolean;
}

export function ChatBubble({ message, isLast = false }: ChatBubbleProps) {
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <div
      className={cn(
        'flex gap-3 mb-4 animate-slide-in',
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      {/* Avatar - Assistant */}
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center shadow-md">
          <Bot className="w-4 h-4 text-white" />
        </div>
      )}

      {/* Message Content */}
      <div
        className={cn(
          'max-w-[85%] lg:max-w-[75%] relative',
          isUser
            ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl rounded-br-none'
            : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-2xl rounded-bl-none shadow-sm border border-gray-200 dark:border-gray-700'
        )}
      >
        <div className="px-4 py-3">
          <div className="text-sm whitespace-pre-wrap break-words leading-relaxed">
            {message.content}
          </div>
        </div>

        {/* Footer */}
        <div
          className={cn(
            'flex items-center justify-between px-4 pb-2',
            isUser ? 'text-blue-100' : 'text-gray-400 dark:text-gray-500'
          )}
        >
          <span className="text-[10px]">
            {formatChatDate(message.createdAt)}
          </span>
          
          <div className="flex items-center gap-1">
            <button
              onClick={handleCopy}
              className={cn(
                'p-1 rounded hover:bg-opacity-20 transition-colors',
                isUser
                  ? 'hover:bg-white'
                  : 'hover:bg-gray-200 dark:hover:bg-gray-700'
              )}
              aria-label="Copiar mensagem"
            >
              {copied ? (
                <Check className="w-3 h-3" />
              ) : (
                <Copy className="w-3 h-3" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Avatar - User */}
      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center shadow-md">
          <User className="w-4 h-4 text-white" />
        </div>
      )}
    </div>
  );
}