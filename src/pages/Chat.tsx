
import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { ChatInterface, Message } from '@/components/chat/ChatInterface';
import { mockModels, mockChatMessages } from '@/data/mock-data';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { queryDocument } from '@/services/api';

const Chat = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  
  // Find the model based on document_id
  const selectedModel = mockModels.find(model => model.document_id === id);
  
  useEffect(() => {
    // In a real implementation, you would fetch messages for this document_id
    // GET /documents/{id}/messages or similar
    if (id) {
      setMessages(mockChatMessages);
    }
  }, [id]);
  
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
      // Use the real API call to query the document
      const response = await queryDocument(id, message);
      
      const responseMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.answer,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, responseMessage]);
    } catch (error) {
      console.error('Error querying document:', error);
      
      // Show error message to user
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm sorry, I encountered an error while processing your query. Please try again later.",
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };
  
  if (!selectedModel && id) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <Loader2 className="h-8 w-8 mx-auto mb-4 animate-spin text-muted-foreground" />
          <p>Loading document data...</p>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <PageHeader 
        title={selectedModel ? selectedModel.name : "Chat Interface"} 
        description={selectedModel ? `Ask questions about your document: ${selectedModel.name}` : "Interact with your documents through natural language."}
      >
        <Button variant="outline" onClick={() => navigate('/models')}>
          <ArrowLeft size={16} className="mr-2" />
          Back to Models
        </Button>
      </PageHeader>
      
      {selectedModel ? (
        <ChatInterface
          modelName={`RAG: ${selectedModel.name}`}
          messages={messages}
          onSendMessage={handleSendMessage}
          isLoading={loading}
          className="max-w-4xl mx-auto"
        />
      ) : (
        <div className="text-center py-12">
          <p>Please select a document to chat with from the Models page.</p>
          <Button 
            className="mt-4"
            onClick={() => navigate('/models')}
          >
            View Models
          </Button>
        </div>
      )}
    </MainLayout>
  );
};

export default Chat;
