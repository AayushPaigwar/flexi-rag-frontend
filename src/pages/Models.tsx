
import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { ModelCard } from '@/components/models/ModelCard';
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  Search,
  SlidersHorizontal,
  Grid,
  List
} from 'lucide-react';
import { mockModels } from '@/data/mock-data';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from '@/hooks/use-toast';

type ViewMode = 'grid' | 'list';
type SortBy = 'recent' | 'name' | 'status';
type FilterStatus = 'all' | 'deployed' | 'training' | 'draft';

const Models = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortBy>('recent');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const handleCreateModel = () => {
    navigate('/models/new');
  };
  
  const handleChatWithModel = (id: string) => {
    navigate(`/chat/${id}`);
  };
  
  const handleEditModel = (id: string) => {
    navigate(`/models/${id}`);
  };
  
  const handleDeleteModel = (id: string) => {
    toast({
      title: "Model deleted",
      description: "The RAG model has been deleted successfully.",
    });
  };
  
  // Filter and sort the models
  const filteredModels = mockModels.filter((model) => {
    if (filterStatus !== 'all' && model.status !== filterStatus) {
      return false;
    }
    
    if (searchQuery) {
      return model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
             model.description.toLowerCase().includes(searchQuery.toLowerCase());
    }
    
    return true;
  }).sort((a, b) => {
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    } else if (sortBy === 'status') {
      return a.status.localeCompare(b.status);
    }
    // Default: recent
    return 0; // In a real app, would compare timestamps
  });

  return (
    <MainLayout>
      <PageHeader 
        title="RAG Models" 
        description="Create, manage, and deploy your custom RAG models."
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex gap-2">
                <SlidersHorizontal size={16} />
                <span className="hidden sm:inline">Filter</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter By Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup value={filterStatus} onValueChange={(v) => setFilterStatus(v as FilterStatus)}>
                <DropdownMenuRadioItem value="all">All Models</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="deployed">Deployed</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="training">Training</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="draft">Drafts</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
              
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Sort By</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup value={sortBy} onValueChange={(v) => setSortBy(v as SortBy)}>
                <DropdownMenuRadioItem value="recent">Most Recent</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="name">Name (A-Z)</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="status">Status</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          
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
              {...model}
              className={viewMode === 'list' ? "!p-4" : ""}
              onChat={handleChatWithModel}
              onEdit={handleEditModel}
              onDelete={handleDeleteModel}
            />
          ))}
        </div>
      )}
    </MainLayout>
  );
};

export default Models;
