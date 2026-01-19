'use client';

import type React from 'react';
import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from 'react';
import type { TypeFormField } from '../../../schema.zod';

// Types for chat messages
export type MessageRole = 'user' | 'assistant';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
}

// Types for agent response (matches the API schema)
export interface EventData {
  title: string;
  description: string;
  venue: string;
  event_type: 'online' | 'offline' | 'hybrid';
  tags: string[];
  rules: string;
  suggested_dates: {
    start_date: string;
    end_date: string;
    publish_date: string;
  };
  is_gated: boolean;
  always_approve: boolean;
}

// Agent field format (flat structure from API)
interface AgentFormField {
  fieldType:
    | 'text'
    | 'textarea'
    | 'radio'
    | 'select'
    | 'checkbox'
    | 'date'
    | 'slider'
    | 'url'
    | 'file';
  label: string;
  name: string;
  description: string;
  required: boolean;
  options: string[];
  checkboxType: 'single' | 'multiple';
  items: Array<{ id: string; label: string }>;
  min: number;
  max: number;
  minLength: number;
  maxLength: number;
}

export interface AgentResponse {
  message: string;
  action:
    | 'none'
    | 'generate_event'
    | 'generate_fields'
    | 'update_event'
    | 'update_fields';
  event_data: EventData;
  form_fields: {
    fields: AgentFormField[];
  };
}

// Transform agent field to TypeFormField
function transformToTypeFormField(field: AgentFormField): TypeFormField {
  const base: TypeFormField = {
    fieldType: field.fieldType as TypeFormField['fieldType'],
    label: field.label,
    name: field.name,
    description: field.description || undefined,
    required: field.required,
  };

  // Add type-specific properties
  if (field.fieldType === 'radio' || field.fieldType === 'select') {
    base.options = field.options.length > 0 ? field.options : undefined;
  }

  if (field.fieldType === 'checkbox') {
    base.checkboxType = field.checkboxType;
    if (field.checkboxType === 'multiple' && field.items.length > 0) {
      base.items = field.items;
    }
  }

  if (field.fieldType === 'slider') {
    base.min = field.min;
    base.max = field.max;
  }

  if (field.fieldType === 'text' || field.fieldType === 'textarea') {
    if (field.minLength > 0 || field.maxLength !== 500) {
      base.validation = {
        minLength: field.minLength,
        maxLength: field.maxLength,
      };
    }
  }

  return base;
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
  onEventDataGenerated: React.RefObject<((data: EventData) => void) | null>;
  onFormFieldsGenerated: React.RefObject<
    ((fields: TypeFormField[]) => void) | null
  >;

  // Active state
  isAgentActive: boolean;
  setIsAgentActive: (active: boolean) => void;
}

const EventAgentContext = createContext<EventAgentContextType | null>(null);

export function EventAgentProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAgentActive, setIsAgentActive] = useState(false);

  // Refs for callbacks (allows form to register handlers)
  const onEventDataGenerated = useRef<((data: EventData) => void) | null>(null);
  const onFormFieldsGenerated = useRef<
    ((fields: TypeFormField[]) => void) | null
  >(null);

  const sendMessage = useCallback(
    async (content: string): Promise<AgentResponse | null> => {
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

        // Handle actions - only trigger callbacks when action is not 'none'
        if (
          data.action === 'generate_event' ||
          data.action === 'update_event'
        ) {
          if (data.event_data && onEventDataGenerated.current) {
            onEventDataGenerated.current(data.event_data);
          }
          // Also generate form fields if present
          if (
            data.form_fields?.fields &&
            data.form_fields.fields.length > 0 &&
            onFormFieldsGenerated.current
          ) {
            const transformedFields = data.form_fields.fields.map(
              transformToTypeFormField
            );
            onFormFieldsGenerated.current(transformedFields);
          }
        }

        if (
          data.action === 'generate_fields' ||
          data.action === 'update_fields'
        ) {
          if (
            data.form_fields?.fields &&
            data.form_fields.fields.length > 0 &&
            onFormFieldsGenerated.current
          ) {
            const transformedFields = data.form_fields.fields.map(
              transformToTypeFormField
            );
            onFormFieldsGenerated.current(transformedFields);
          }
        }

        return data;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'An error occurred';
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
    },
    [messages]
  );

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
