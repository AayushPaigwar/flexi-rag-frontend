
import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { ModelCard } from '@/components/models/ModelCard';
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  Search,
  Grid,
  List
} from 'lucide-react';
import { mockCurrentUser } from '@/data/mock-data';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';

type ViewMode = 'grid' | 'list';

const Models = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  
  const handleCreateModel = () => {
    navigate('/upload');
  };
  
  const handleChatWithModel = (id: string, document_id: string) => {
    navigate(`/chat/${document_id}`);
  };
  
  const handleOpenModel = (id: string, document_id: string) => {
    navigate(`/models/${document_id}`);
  };
  
  // Mock models data for display
  const mockModels = [
    {
      id: '1',
      document_id: 'doc-1',
      file_name: 'Product Documentation.pdf',
      file_type: 'application/pdf',
      createdAt: '2024-01-15',
    },
    {
      id: '2',
      document_id: 'doc-2',
      file_name: 'Technical Specs.docx',
      file_type: 'application/docx',
      createdAt: '2024-01-20',
    },
    {
      id: '3',
      document_id: 'doc-3',
      file_name: 'User Manual.pdf',
      file_type: 'application/pdf',
      createdAt: '2024-01-25',
    },
  ];

  // Filter models based on search query
  const filteredModels = mockModels.filter((model) => {
    if (searchQuery) {
      return model.file_name.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  return (
    <MainLayout>
      <PageHeader 
        title="RAG Models" 
        description={`Create, manage, and deploy your custom RAG models. User: ${mockCurrentUser.name}`}
      >
        <Button onClick={handleCreateModel}>
          <Plus size={16} className="mr-2" />
          New Model
        </Button>
      </PageHeader>
      
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
          <Input
            placeholder="Search models..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('grid')}
          >
            <Grid size={16} />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('list')}
          >
            <List size={16} />
          </Button>
        </div>
      </div>
      
      {filteredModels.length === 0 ? (
        <div className="text-center p-12 border border-dashed rounded-xl">
          <h3 className="text-lg font-medium mb-2">No models found</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery 
              ? "Try adjusting your search or filters" 
              : "Get started by creating your first RAG model"}
          </p>
          <Button onClick={handleCreateModel}>
            <Plus size={16} className="mr-2" />
            New Model
          </Button>
        </div>
      ) : (
        <div className={viewMode === 'grid' 
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          : "space-y-4"
        }>
          {filteredModels.map((model) => (
            <ModelCard 
              key={model.id}
              id={model.id}
              document_id={model.document_id}
              file_name={model.file_name}
              file_type={model.file_type}
              createdAt={model.createdAt}
              className={viewMode === 'list' ? "!p-4" : ""}
              onChat={handleChatWithModel}
              onOpen={handleOpenModel}
            />
          ))}
        </div>
      )}
    </MainLayout>
  );
};

export default Models;
