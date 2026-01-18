'use client';

import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import type { TypeFormField } from '../../../schema.zod';

// Types for chat messages
export type MessageRole = 'user' | 'assistant';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
}

// Types for agent response
export interface EventData {
  title?: string;
  description?: string;
  venue?: string;
  event_type?: 'online' | 'offline' | 'hybrid';
  tags?: string[];
  rules?: string;
  suggested_dates?: {
    start_date: string;
    end_date: string;
    publish_date: string;
  };
  is_gated?: boolean;
  always_approve?: boolean;
}

export interface AgentResponse {
  message: string;
  action: 'none' | 'generate_event' | 'generate_fields' | 'update_event' | 'update_fields';
  event_data?: EventData;
  form_fields?: {
    fields: TypeFormField[];
  };
}

// Context type
interface EventAgentContextType {
  // Chat state
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  sendMessage: (content: string) => Promise<AgentResponse | null>;
  clearChat: () => void;
  
  // Form autofill callbacks (to be set by the form page)
  onEventDataGenerated: React.MutableRefObject<((data: EventData) => void) | null>;
  onFormFieldsGenerated: React.MutableRefObject<((fields: TypeFormField[]) => void) | null>;
  
  // Active state
  isAgentActive: boolean;
  setIsAgentActive: (active: boolean) => void;
}

const EventAgentContext = createContext<EventAgentContextType | null>(null);

export function EventAgentProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAgentActive, setIsAgentActive] = useState(false);
  
  // Refs for callbacks (allows form to register handlers)
  const onEventDataGenerated = useRef<((data: EventData) => void) | null>(null);
  const onFormFieldsGenerated = useRef<((fields: TypeFormField[]) => void) | null>(null);

  const sendMessage = useCallback(async (content: string): Promise<AgentResponse | null> => {
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      // Build message history for context
      const messageHistory = [...messages, userMessage].map(msg => ({
        role: msg.role,
        content: msg.content,
      }));

      const response = await fetch('/api/agent/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: messageHistory }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get response');
      }

      const data: AgentResponse = await response.json();

      // Add assistant message
      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.message,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);

      // Handle actions
      if (data.action === 'generate_event' || data.action === 'update_event') {
        if (data.event_data && onEventDataGenerated.current) {
          onEventDataGenerated.current(data.event_data);
        }
      }

      if (data.action === 'generate_fields' || data.action === 'update_fields') {
        if (data.form_fields?.fields && onFormFieldsGenerated.current) {
          onFormFieldsGenerated.current(data.form_fields.fields);
        }
      }

      // Handle combined generation
      if (data.action === 'generate_event' && data.form_fields?.fields) {
        if (onFormFieldsGenerated.current) {
          onFormFieldsGenerated.current(data.form_fields.fields);
        }
      }

      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      
      // Add error message to chat
      const errorChatMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: `Sorry, I encountered an error: ${errorMessage}. Please try again.`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorChatMessage]);
      
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [messages]);

  const clearChat = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return (
    <EventAgentContext.Provider
      value={{
        messages,
        isLoading,
        error,
        sendMessage,
        clearChat,
        onEventDataGenerated,
        onFormFieldsGenerated,
        isAgentActive,
        setIsAgentActive,
      }}
    >
      {children}
    </EventAgentContext.Provider>
  );
}

export function useEventAgent() {
  const context = useContext(EventAgentContext);
  if (!context) {
    throw new Error('useEventAgent must be used within an EventAgentProvider');
  }
  return context;
}
