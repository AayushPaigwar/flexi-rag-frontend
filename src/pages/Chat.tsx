
import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { ChatInterface, Message } from '@/components/chat/ChatInterface';
import { mockModels, mockChatMessages } from '@/data/mock-data';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
  
  const handleSendMessage = (message: string) => {
    if (!id) return;
    
    const newUserMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, newUserMessage]);
    setLoading(true);
    
    // In a real implementation, this would call the API endpoint:
    // POST /query/ with document_id and query
    setTimeout(() => {
      const responseMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: getSimulatedResponse(message),
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, responseMessage]);
      setLoading(false);
    }, 1500);
  };
  
  // Simple simulation of responses
  const getSimulatedResponse = (message: string): string => {
    const lowercaseMessage = message.toLowerCase();
    
    if (lowercaseMessage.includes('hello') || lowercaseMessage.includes('hi')) {
      return "Hello! I'm your RAG assistant for this document. How can I help you today?";
    }
    
    if (lowercaseMessage.includes('feature') || lowercaseMessage.includes('capabilities')) {
      return "This RAG platform offers several key features:\n\n• Upload custom documents (PDF, CSV, TXT, JSON, DOCX, XLSX)\n• Automatic chunking and embedding generation\n• Vector search for relevant context retrieval\n• Query processing with Gemini AI\n• Context-aware responses based on your documents";
    }
    
    if (lowercaseMessage.includes('upload') || lowercaseMessage.includes('file')) {
      return "You can upload various file types including PDF documents, CSV files, TXT files, JSON data, Word documents, and Excel spreadsheets. The system will automatically process your documents, extract text, chunk it appropriately, and generate embeddings for retrieval.";
    }
    
    return "I've analyzed your query using the context from your uploaded document. Based on the information available, I can provide the following insights: [This would contain actual retrieved context in a real implementation]. Is there anything specific you'd like me to elaborate on?";
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
        description={selectedModel ? `Ask questions about your document: ${selectedModel.file_name || selectedModel.name}` : "Interact with your documents through natural language."}
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
