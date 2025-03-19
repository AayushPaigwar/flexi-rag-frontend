
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChatInterface, Message } from '@/components/chat/ChatInterface';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { queryDocument } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

const Chat = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  
  const handleSendMessage = async (message: string) => {
    if (!id) return;
    
    const newUserMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, newUserMessage]);
    setLoading(true);
    
    try {
      const response = await queryDocument(id, message);
      
      // Process the response to ensure markdown formatting is preserved
      const formattedAnswer = response.answer || "No answer provided";
      
      const responseMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: formattedAnswer,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, responseMessage]);
    } catch (error) {
      console.error('Error querying document:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm sorry, I encountered an error while processing your query. Please try again later.",
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "Error querying document",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center mb-6">
        <Button 
          variant="outline" 
          onClick={() => {
            const userId = localStorage.getItem('currentUserId');
            navigate(userId ? `/documents/${userId}` : '/');
          }} 
          className="mr-4"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Documents
        </Button>
        <h1 className="text-3xl font-bold">Chat with Document</h1>
      </div>
      
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Ask questions about your document</CardTitle>
        </CardHeader>
        <CardContent>
          {!id ? (
            <div className="text-center py-12">
              <Loader2 className="h-8 w-8 mx-auto mb-4 animate-spin text-muted-foreground" />
              <p>Document not found. Please select a valid document.</p>
              <Button 
                className="mt-4"
                onClick={() => {
                  const userId = localStorage.getItem('currentUserId');
                  navigate(userId ? `/documents/${userId}` : '/');
                }}
              >
                View Documents
              </Button>
            </div>
          ) : (
            <ChatInterface
              modelName="RAG Assistant"
              messages={messages}
              onSendMessage={handleSendMessage}
              isLoading={loading}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Chat;
