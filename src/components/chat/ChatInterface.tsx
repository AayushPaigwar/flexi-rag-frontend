
import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Bot, User, Paperclip, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatInterfaceProps {
  modelName?: string;
  messages?: Message[];
  onSendMessage?: (message: string) => void;
  isLoading?: boolean;
  className?: string;
}

export function ChatInterface({
  modelName = 'FlexiRAG Assistant',
  messages = [],
  onSendMessage,
  isLoading = false,
  className
}: ChatInterfaceProps) {
  const [input, setInput] = useState('');
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Focus input on load
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSendMessage = () => {
    if (input.trim() && onSendMessage && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className={cn(
      "flex flex-col bg-white rounded-xl border border-border/40 shadow-sm overflow-hidden h-[600px]",
      className
    )}>
      {/* Chat header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary/10 rounded-full">
            <Bot size={18} className="text-primary" />
          </div>
          <h3 className="font-medium">{modelName}</h3>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon">
            <Plus size={18} />
          </Button>
        </div>
      </div>
      
      {/* Chat messages */}
      <ScrollArea className="flex-1 p-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-6 animate-fade-in">
            <div className="p-4 bg-primary/10 rounded-full mb-4">
              <Bot size={24} className="text-primary" />
            </div>
            <h3 className="text-lg font-medium mb-2">Welcome to FlexiRAG</h3>
            <p className="text-muted-foreground max-w-sm">
              This AI assistant is powered by your custom RAG model. Ask any questions about your data.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            <div ref={endOfMessagesRef} />
          </div>
        )}
      </ScrollArea>
      
      {/* Input area */}
      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" className="shrink-0">
            <Paperclip size={18} />
          </Button>
          <div className="relative flex-1">
            <Textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a question..."
              className="resize-none pr-10 py-2 min-h-[2.5rem] max-h-[8rem]"
              disabled={isLoading}
            />
            <Button
              size="icon"
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
              onClick={handleSendMessage}
              disabled={isLoading || !input.trim()}
            >
              {isLoading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Send size={18} />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChatMessage({ message }: { message: Message }) {
  const isUser = message.role === 'user';
  
  return (
    <div className={cn(
      "flex gap-3",
      isUser ? "justify-end" : "justify-start"
    )}>
      {!isUser && (
        <div className="p-2 h-8 bg-primary/10 rounded-full shrink-0">
          <Bot size={16} className="text-primary" />
        </div>
      )}
      <div className={cn(
        "rounded-xl px-4 py-2 max-w-[80%] animate-slide-up",
        isUser 
          ? "bg-primary text-primary-foreground rounded-tr-none" 
          : "bg-secondary text-secondary-foreground rounded-tl-none"
      )}>
        <p className="whitespace-pre-wrap text-sm">{message.content}</p>
      </div>
      {isUser && (
        <div className="p-2 h-8 bg-muted rounded-full shrink-0">
          <User size={16} className="text-muted-foreground" />
        </div>
      )}
    </div>
  );
}
