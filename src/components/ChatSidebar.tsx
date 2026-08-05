'use client';

import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Plus,
  Settings,
  Trash2,
  Clock,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useUser, useClerk } from '@clerk/nextjs';
import { cn, truncateText, formatRelativeTime, getInitials } from '@/lib/utils';

interface Conversation {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt?: Date;
  messageCount?: number;
}

interface ChatSidebarProps {
  conversations: Conversation[];
  currentConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  onDeleteConversation: (id: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
  className?: string;
}

export function ChatSidebar({
  conversations,
  currentConversationId,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
  isOpen = true,
  onClose,
  className,
}: ChatSidebarProps) {
  const { user } = useUser();
  const { signOut } = useClerk();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [hoveredConversation, setHoveredConversation] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsMobileOpen(false);
    }
  }, [currentConversationId]);

  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const handleSelectConversation = (id: string) => {
    onSelectConversation(id);
    if (window.innerWidth < 768) {
      setIsMobileOpen(false);
    }
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('Tem certeza que deseja excluir esta conversa?')) {
      onDeleteConversation(id);
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={toggleMobileSidebar}
        className="fixed top-4 left-4 z-50 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-md md:hidden border border-gray-200 dark:border-gray-700"
        aria-label="Toggle sidebar"
      >
        {isMobileOpen ? (
          <X className="w-5 h-5 text-gray-700 dark:text-gray-200" />
        ) : (
          <Menu className="w-5 h-5 text-gray-700 dark:text-gray-200" />
        )}
      </button>

      {/* Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 h-full w-80 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 z-40',
          'transition-transform duration-300 ease-in-out',
          'flex flex-col',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full',
          'md:translate-x-0',
          className
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                LEAF AI
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Assistant
              </p>
            </div>
          </div>
          <button
            onClick={onNewConversation}
            className="p-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 text-white shadow-md"
            aria-label="Nova conversa"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* User Info */}
        {user && (
          <div className="flex items-center gap-3 p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-semibold shadow-md flex-shrink-0">
              {user.imageUrl ? (
                <img
                  src={user.imageUrl}
                  alt={user.fullName || 'User'}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                getInitials(user.fullName || user.username || 'User')
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                {user.fullName || user.username || 'Usuário'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {user.primaryEmailAddress?.emailAddress || ''}
              </p>
            </div>
            <button
              onClick={() => signOut()}
              className="p-2 rounded-lg text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              aria-label="Sair"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Search Bar */}
        <div className="p-3 border-b border-gray-200 dark:border-gray-700">
          <input
            type="text"
            placeholder="Buscar conversas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 text-sm bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
          />
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {filteredConversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <MessageSquare className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-3" />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Nenhuma conversa ainda
              </p>
            </div>
          ) : (
            filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => handleSelectConversation(conversation.id)}
                onMouseEnter={() => setHoveredConversation(conversation.id)}
                onMouseLeave={() => setHoveredConversation(null)}
                className={cn(
                  'group relative flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200',
                  currentConversationId === conversation.id
                    ? 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800/50'
                )}
              >
                <MessageSquare className="w-4 h-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate text-gray-900 dark:text-white">
                    {truncateText(conversation.title, 35)}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-400">
                      {formatRelativeTime(conversation.createdAt)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={(e) => handleDelete(e, conversation.id)}
                  className={cn(
                    'p-1.5 rounded-lg transition-all duration-200',
                    hoveredConversation === conversation.id
                      ? 'opacity-100'
                      : 'opacity-0',
                    'hover:bg-red-100 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500'
                  )}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <button className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300">
            <Settings className="w-4 h-4" />
            <span className="text-sm font-medium">Configurações</span>
          </button>
        </div>
      </aside>
    </>
  );
}