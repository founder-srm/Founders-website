'use client';

import { Bot, Loader2, RefreshCw, Send, Sparkles } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDashboardData } from '@/components/providers/DashboardDataProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const PRESET_QUESTIONS = [
  'Give me a summary of the dashboard',
  'What are the top performing events?',
  'How are registration trends looking?',
  'What is our acceptance rate?',
];

export function DashboardAIInsights() {
  const {
    getDataSummary,
    stats,
    eventPerformance,
    isLoading: dataLoading,
  } = useDashboardData();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Generate AI response based on dashboard data
  const generateResponse = useCallback(
    async (question: string): Promise<string> => {
      const dataSummary = getDataSummary();
      const lowerQuestion = question.toLowerCase();

      // Simple local responses based on data - no API call needed for basic questions
      if (
        lowerQuestion.includes('summary') ||
        lowerQuestion.includes('overview')
      ) {
        return `📊 **Dashboard Summary**

Here's your current status:
- **${stats.totalEvents}** total events created
- **${stats.totalRegistrations}** total registrations
- **${stats.acceptanceRate.toFixed(1)}%** acceptance rate
- **${stats.avgRegistrationsPerEvent.toFixed(1)}** average registrations per event

${
  stats.recentTrend === 'up'
    ? `📈 Registrations are **trending up** by ${stats.trendPercentage.toFixed(1)}% compared to last week!`
    : stats.recentTrend === 'down'
      ? `📉 Registrations are **down** by ${stats.trendPercentage.toFixed(1)}% compared to last week.`
      : '📊 Registrations have been **stable** this week.'
}

Your most popular event is **"${stats.mostPopularEvent}"**.`;
      }

      if (
        lowerQuestion.includes('top') ||
        lowerQuestion.includes('performing') ||
        lowerQuestion.includes('popular')
      ) {
        const top3 = eventPerformance.slice(0, 3);
        if (top3.length === 0) return 'No events have registrations yet.';

        return `🏆 **Top Performing Events**

${top3
  .map(
    (e, i) => `${i + 1}. **${e.title}**
   - ${e.registrations} registrations
   - ${e.accepted} accepted (${e.conversionRate.toFixed(0)}% conversion rate)`
  )
  .join('\n\n')}

${
  top3[0].conversionRate > 80
    ? '✨ Great conversion rates! Your events are attracting quality registrations.'
    : 'Consider promoting these events more to increase registrations.'
}`;
      }

      if (lowerQuestion.includes('trend') || lowerQuestion.includes('growth')) {
        return `📈 **Registration Trends**

${
  stats.recentTrend === 'up'
    ? `Great news! Registrations are **up ${stats.trendPercentage.toFixed(1)}%** this week compared to the previous week.`
    : stats.recentTrend === 'down'
      ? `Registrations are **down ${stats.trendPercentage.toFixed(1)}%** this week. Consider:\n- Promoting upcoming events on social media\n- Sending reminder emails to your community\n- Creating engaging event content`
      : 'Registrations have been **stable** this week.'
}

**Current Stats:**
- Total registrations: ${stats.totalRegistrations}
- Average per event: ${stats.avgRegistrationsPerEvent.toFixed(1)}
- Pending reviews: ${stats.pendingRegistrations}`;
      }

      if (
        lowerQuestion.includes('acceptance') ||
        lowerQuestion.includes('approval') ||
        lowerQuestion.includes('rate')
      ) {
        const rate = stats.acceptanceRate;
        return `✅ **Acceptance Rate Analysis**

Your current acceptance rate is **${rate.toFixed(1)}%**

**Breakdown:**
- Accepted: ${stats.acceptedRegistrations}
- Pending: ${stats.pendingRegistrations}
- Rejected: ${stats.rejectedRegistrations}

${
  rate > 80
    ? '🌟 Excellent acceptance rate! Your screening process is efficient.'
    : rate > 50
      ? '👍 Good acceptance rate. Review pending registrations to maintain quality.'
      : '⚠️ Low acceptance rate. Consider reviewing your registration criteria or event targeting.'
}

${
  stats.pendingRegistrations > 10
    ? `\n⏳ You have **${stats.pendingRegistrations} pending registrations** to review.`
    : ''
}`;
      }

      if (lowerQuestion.includes('event') && lowerQuestion.includes('type')) {
        return `📋 **Event Type Distribution**

You have **${stats.totalEvents}** events total.

Events are being organized effectively across different categories. Check the Event Types chart for the visual breakdown.`;
      }

      // Default response with summary
      return `Based on your dashboard data:

${dataSummary}

Feel free to ask specific questions about:
- Top performing events
- Registration trends
- Acceptance rates
- Event statistics`;
    },
    [getDataSummary, stats, eventPerformance]
  );

  const handleSend = async (message?: string) => {
    const query = message || input.trim();
    if (!query || isLoading || dataLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: query,
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await generateResponse(query);

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: response,
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch {
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content:
          'Sorry, I encountered an error analyzing the data. Please try again.',
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Card className="flex flex-col h-full border-none rounded-none p-0 m-0">
      <CardHeader className="pb-3 border-b">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Sparkles className="h-5 w-5 text-primary" />
          AI Dashboard Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
        {/* Messages area */}
        <ScrollArea ref={scrollRef} className="flex-1 p-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <Bot className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="font-medium mb-2">Ask about your data</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Get insights and summaries about your events and registrations.
              </p>

              {/* Preset questions */}
              <div className="w-full space-y-2">
                <p className="text-xs text-muted-foreground mb-2">
                  Quick questions:
                </p>
                <div className="grid grid-cols-1 gap-2">
                  {PRESET_QUESTIONS.map(question => (
                    <Button
                      key={question}
                      variant="outline"
                      size="sm"
                      className="text-xs h-auto py-2 px-3 justify-start text-left"
                      onClick={() => handleSend(question)}
                      disabled={isLoading || dataLoading}
                    >
                      {question}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map(message => (
                <div
                  key={message.id}
                  className={cn(
                    'flex gap-2',
                    message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                  )}
                >
                  <div
                    className={cn(
                      'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center',
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    )}
                  >
                    {message.role === 'user' ? (
                      <span className="text-xs font-medium">You</span>
                    ) : (
                      <Bot className="h-4 w-4" />
                    )}
                  </div>
                  <div
                    className={cn(
                      'max-w-[85%] rounded-lg px-3 py-2 text-sm',
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-foreground'
                    )}
                  >
                    <p className="whitespace-pre-wrap break-words">
                      {message.content}
                    </p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-2">
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
              )}
            </div>
          )}
        </ScrollArea>

        {/* Input area */}
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Input
              placeholder="Ask about your dashboard data..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading || dataLoading}
              className="text-sm"
            />
            <Button
              size="icon"
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading || dataLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
          {messages.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="mt-2 text-xs w-full"
              onClick={() => setMessages([])}
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Clear chat
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
