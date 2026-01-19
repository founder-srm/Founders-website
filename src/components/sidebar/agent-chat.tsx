'use client';

import { Bot, Loader2, Send, Sparkles, Trash2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import {
  type ChatMessage,
  useEventAgent,
} from '@/components/providers/EventAgentProvider';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

// Message bubble component
function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user';

  return (
    <div
      className={cn(
        'flex gap-2 mb-4',
        isUser ? 'flex-row-reverse' : 'flex-row'
      )}
    >
      <div
        className={cn(
          'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center',
          isUser ? 'bg-primary text-primary-foreground' : 'bg-muted'
        )}
      >
        {isUser ? (
          <span className="text-xs font-medium">You</span>
        ) : (
          <Bot className="h-4 w-4" />
        )}
      </div>
      <div
        className={cn(
          'max-w-[80%] rounded-lg px-3 py-2 text-sm',
          isUser
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted text-foreground'
        )}
      >
        <p className="whitespace-pre-wrap break-words">{message.content}</p>
        <span className="text-[10px] opacity-60 mt-1 block">
          {message.timestamp.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      </div>
    </div>
  );
}

// Typing indicator
function TypingIndicator() {
  return (
    <div className="flex gap-2 mb-4">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center">
        <Bot className="h-4 w-4" />
      </div>
      <div className="bg-muted rounded-lg px-3 py-2">
        <div className="flex gap-1">
          <span
            className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce"
            style={{ animationDelay: '0ms' }}
          />
          <span
            className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce"
            style={{ animationDelay: '150ms' }}
          />
          <span
            className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce"
            style={{ animationDelay: '300ms' }}
          />
        </div>
      </div>
    </div>
  );
}

// Quick action suggestions
const QUICK_ACTIONS = [
  {
    label: 'Hackathon',
    prompt: 'Create a hackathon event with team registration',
  },
  { label: 'Workshop', prompt: 'Create a technical workshop event' },
  { label: 'Networking', prompt: 'Create a networking/meetup event' },
  { label: 'Competition', prompt: 'Create a coding competition event' },
];

export function AgentChat() {
  const { messages, isLoading, sendMessage, clearChat } = useEventAgent();
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const message = input.trim();
    setInput('');
    await sendMessage(message);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickAction = async (prompt: string) => {
    if (isLoading) return;
    await sendMessage(prompt);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="font-medium text-sm">Event Assistant</span>
        </div>
        {messages.length > 0 && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={clearChat}
            title="Clear chat"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Messages area */}
      <ScrollArea ref={scrollRef} className="flex-1 p-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <Bot className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="font-medium mb-2">Event Creation Assistant</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Describe your event and I&apos;ll help you create the form fields
              and details.
            </p>

            {/* Quick actions */}
            <div className="w-full space-y-2">
              <p className="text-xs text-muted-foreground mb-2">Quick start:</p>
              <div className="grid grid-cols-2 gap-2">
                {QUICK_ACTIONS.map(action => (
                  <Button
                    key={action.label}
                    variant="outline"
                    size="sm"
                    className="text-xs h-auto py-2 px-3"
                    onClick={() => handleQuickAction(action.prompt)}
                    disabled={isLoading}
                  >
                    {action.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div>
            {messages.map(message => (
              <MessageBubble key={message.id} message={message} />
            ))}
            {isLoading && <TypingIndicator />}
          </div>
        )}
      </ScrollArea>

      {/* Input area */}
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Textarea
            ref={textareaRef}
            placeholder="Describe your event..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="min-h-[60px] max-h-[120px] resize-none text-sm"
            disabled={isLoading}
          />
          <Button
            size="icon"
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="h-[60px] w-10"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
        <p className="text-[10px] text-muted-foreground mt-2 text-center">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
