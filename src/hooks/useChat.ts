// src/hooks/useChat.ts
import { useState, useCallback } from 'react';
import { Message } from '@/types/chat';
import { generateId } from '@/lib/utils';

interface UseChatProps {
  initialMessages?: Message[];
  conversationId?: string | null;
}

export function useChat({ initialMessages = [], conversationId = null }: UseChatProps = {}) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(conversationId);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content: content.trim(),
      createdAt: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: content.trim(),
          conversationId: currentConversationId,
          stream: false,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to send message');
      }

      const data = await response.json();
      
      const assistantMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: data.content || 'Desculpe, não consegui processar sua mensagem.',
        createdAt: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      if (data.conversationId) {
        setCurrentConversationId(data.conversationId);
      }

      return assistantMessage;
    } catch (error) {
      console.error('Error sending message:', error);
      
      const errorMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: 'Desculpe, ocorreu um erro ao processar sua mensagem. Por favor, tente novamente.',
        createdAt: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
      
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [currentConversationId]);

  const streamMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content: content.trim(),
      createdAt: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: content.trim(),
          conversationId: currentConversationId,
          stream: true,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Response error:', errorData);
        throw new Error(errorData.error || 'Failed to stream message');
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No reader available');
      }

      const decoder = new TextDecoder();
      let assistantContent = '';

      const assistantMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: '',
        createdAt: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;
            
            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                assistantContent += parsed.content;
                setMessages(prev => {
                  const newMessages = [...prev];
                  const lastMessage = newMessages[newMessages.length - 1];
                  if (lastMessage && lastMessage.id === assistantMessage.id) {
                    lastMessage.content = assistantContent;
                  }
                  return newMessages;
                });
              }
            } catch (e) {
              console.error('Error parsing stream data:', e);
            }
          }
        }
      }

      // Se não recebeu conteúdo, mostra mensagem padrão
      if (!assistantContent) {
        setMessages(prev => {
          const newMessages = [...prev];
          const lastMessage = newMessages[newMessages.length - 1];
          if (lastMessage && lastMessage.id === assistantMessage.id) {
            lastMessage.content = 'Desculpe, não consegui processar sua mensagem.';
          }
          return newMessages;
        });
      }

      return assistantMessage;
    } catch (error) {
      console.error('Error streaming message:', error);
      
      const errorMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: 'Desculpe, ocorreu um erro ao processar sua mensagem. Por favor, tente novamente.',
        createdAt: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
      
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [currentConversationId]);

  const clearHistory = useCallback(() => {
    setMessages([]);
    setCurrentConversationId(null);
  }, []);

  const saveConversation = useCallback(async () => {
    if (!currentConversationId || messages.length === 0) return;

    try {
      const response = await fetch('/api/history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversationId: currentConversationId,
          messages,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save conversation');
      }

      return await response.json();
    } catch (error) {
      console.error('Error saving conversation:', error);
      throw error;
    }
  }, [currentConversationId, messages]);

  const loadConversation = useCallback(async (conversationId: string) => {
    try {
      const response = await fetch(`/api/history?conversationId=${conversationId}`);
      if (!response.ok) {
        throw new Error('Failed to load conversation');
      }

      const data = await response.json();
      setMessages(data.messages || []);
      setCurrentConversationId(conversationId);
    } catch (error) {
      console.error('Error loading conversation:', error);
      throw error;
    }
  }, []);

  return {
    messages,
    isLoading,
    currentConversationId,
    sendMessage,
    streamMessage,
    clearHistory,
    saveConversation,
    loadConversation,
    setMessages,
  };
}