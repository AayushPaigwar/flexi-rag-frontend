
import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { ChatInterface, Message } from '@/components/chat/ChatInterface';
import { mockModels, mockChatMessages } from '@/data/mock-data';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from 'lucide-react';

const Chat = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedModelId, setSelectedModelId] = useState<string>(id || '');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  
  const selectedModel = mockModels.find(model => model.id === selectedModelId);
  
  useEffect(() => {
    // Set initial model if provided in URL
    if (id && mockModels.some(model => model.id === id)) {
      setSelectedModelId(id);
      // In a real app, you'd fetch chat history for this model
      setMessages(mockChatMessages);
    } else if (mockModels.length > 0 && !selectedModelId) {
      // Default to first model if none selected
      setSelectedModelId(mockModels[0].id);
    }
  }, [id]);
  
  const handleModelChange = (value: string) => {
    setSelectedModelId(value);
    navigate(`/chat/${value}`);
    // In a real app, you'd fetch chat history for the selected model
    setMessages(mockChatMessages);
  };
  
  const handleSendMessage = (message: string) => {
    const newUserMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, newUserMessage]);
    setLoading(true);
    
    // Simulate API response delay
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
      return "Hello! I'm your RAG assistant. How can I help you today?";
    }
    
    if (lowercaseMessage.includes('feature') || lowercaseMessage.includes('capabilities')) {
      return "This RAG platform offers several key features:\n\n• Upload custom documents (PDF, CSV, TXT, JSON)\n• Automatic chunking and embedding generation\n• Vector search for relevant context retrieval\n• Query processing with selected LLM model\n• Customizable retrieval parameters\n• One-click Vercel deployment\n• API access for integration with other systems";
    }
    
    if (lowercaseMessage.includes('upload') || lowercaseMessage.includes('file')) {
      return "To upload files, navigate to the Upload page from the sidebar. You can upload PDF documents, CSV files, TXT files, or JSON data. The system will automatically process your documents, extract text, chunk it appropriately, and generate embeddings for retrieval.";
    }
    
    return "I've analyzed your query using the context from your uploaded documents. Based on the information available, I can provide the following insights: [This would contain actual retrieved context in a real implementation]. Is there anything specific you'd like me to elaborate on?";
  };
  
  return (
    <MainLayout>
      <PageHeader 
        title="Chat Interface" 
        description="Interact with your custom RAG models through natural language."
      />
      
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">
          Select RAG Model
        </label>
        <Select
          value={selectedModelId}
          onValueChange={handleModelChange}
        >
          <SelectTrigger className="w-full max-w-md">
            <SelectValue placeholder="Select a model" />
          </SelectTrigger>
          <SelectContent>
            {mockModels.map((model) => (
              <SelectItem key={model.id} value={model.id}>
                {model.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {selectedModelId ? (
        <ChatInterface
          modelName={selectedModel?.name || 'FlexiRAG Assistant'}
          messages={messages}
          onSendMessage={handleSendMessage}
          isLoading={loading}
          className="max-w-4xl mx-auto"
        />
      ) : (
        <div className="text-center py-12">
          <Loader2 className="h-8 w-8 mx-auto mb-4 animate-spin text-muted-foreground" />
          <p>Loading models...</p>
        </div>
      )}
    </MainLayout>
  );
};

export default Chat;
