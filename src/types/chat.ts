export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: Date;
}

export interface Conversation {
  id: string;
  userId: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  messages: Message[];
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  currentConversationId: string | null;
  conversations: Conversation[];
}

export interface SpeechToTextResponse {
  text: string;
}

export interface TextToSpeechResponse {
  audioUrl: string;
}