import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Bot, Loader2, Send, User } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";

export interface Message {
  id: string;
  role: "user" | "assistant";
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
  modelName = "FlexiRAG Assistant",
  messages = [],
  onSendMessage,
  isLoading = false,
  className,
}: ChatInterfaceProps) {
  const [input, setInput] = useState("");
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSendMessage = () => {
    if (input.trim() && onSendMessage && !isLoading) {
      onSendMessage(input.trim());
      setInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col bg-background/95 backdrop-blur-md rounded-xl border shadow-lg",
        "h-[600px] transition-all duration-300 ease-in-out",
        className
      )}
    >
      <div className="p-4 border-b bg-muted/20 backdrop-blur-sm rounded-t-xl">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-full animate-pulse">
            <Bot size={20} className="text-primary" />
          </div>
          <div>
            <h3 className="font-medium text-lg">{modelName}</h3>
            <p className="text-sm text-muted-foreground">Ready to assist you</p>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-6 animate-fade-in">
            <div className="p-4 bg-primary/10 rounded-full mb-4 animate-float">
              <Bot size={32} className="text-primary" />
            </div>
            <h3 className="text-xl font-medium mb-2">Welcome to FlexiRAG</h3>
            <p className="text-muted-foreground max-w-sm">
              Your AI assistant is ready to help. Ask any questions about your
              documents.
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

      <div className="p-4 border-t bg-muted/20 backdrop-blur-sm rounded-b-xl">
        <div className="relative">
          <Textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a question..."
            className="resize-none pr-12 py-3 min-h-[2.5rem] max-h-[8rem] rounded-xl border-muted"
            disabled={isLoading}
          />
          <Button
            size="icon"
            className={cn(
              "absolute right-2 top-1/2 transform -translate-y-1/2",
              "transition-all duration-200",
              isLoading ? "animate-pulse" : "hover:scale-105"
            )}
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
  );
}

function ChatMessage({ message }: { message: Message }) {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex gap-3", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <div className="p-2 h-8 bg-blue-100 rounded-full shrink-0">
          <Bot size={16} className="text-blue-600" />
        </div>
      )}
      <div
        className={cn(
          "rounded-xl px-4 py-2 max-w-[80%] animate-slide-up break-words overflow-hidden",
          isUser
            ? "bg-blue-600 text-white rounded-tr-none"
            : "bg-blue-50 text-blue-900 rounded-tl-none border border-blue-100"
        )}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap text-sm">{message.content}</p>
        ) : (
          <div className="prose prose-sm dark:prose-invert max-w-none text-secondary-foreground overflow-auto">
            <ReactMarkdown className="break-words overflow-wrap-anywhere">
              {message.content}
            </ReactMarkdown>
          </div>
        )}
      </div>
      {isUser && (
        <div className="p-2 h-8 bg-muted rounded-full shrink-0">
          <User size={16} className="text-muted-foreground" />
        </div>
      )}
    </div>
  );
}
