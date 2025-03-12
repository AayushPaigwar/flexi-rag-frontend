
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { ModelCard } from '@/components/models/ModelCard';
import { Button } from '@/components/ui/button';
import { Plus, BarChart2, Database, MessageSquare, Server } from 'lucide-react';
import { mockModels, mockUsageStats, mockDeploymentStats } from '@/data/mock-data';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
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
  
  return (
    <MainLayout>
      <PageHeader 
        title="Dashboard" 
        description="Manage your RAG models and view analytics."
      >
        <Button onClick={handleCreateModel}>
          <Plus size={16} className="mr-2" />
          New Model
        </Button>
      </PageHeader>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard 
          title="Total Models" 
          value={mockModels.length} 
          icon={<Database size={20} />}
          trend={{ value: 25, positive: true }}
        />
        <StatsCard 
          title="Total Queries" 
          value={mockUsageStats.totalQueries.toLocaleString()} 
          icon={<MessageSquare size={20} />}
          trend={{ value: 12, positive: true }}
        />
        <StatsCard 
          title="Active Deployments" 
          value={mockDeploymentStats.activeDeployments} 
          icon={<Server size={20} />}
          trend={{ value: 50, positive: true }}
        />
        <StatsCard 
          title="Average Precision" 
          value={`${mockUsageStats.averagePrecision}%`} 
          icon={<BarChart2 size={20} />}
          trend={{ value: 2, positive: true }}
        />
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Recent Models</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockModels.slice(0, 3).map((model) => (
            <ModelCard 
              key={model.id}
              {...model}
              onChat={handleChatWithModel}
              onEdit={handleEditModel}
              onDelete={handleDeleteModel}
            />
          ))}
        </div>
      </div>
      
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Quick Actions</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <ActionCard 
            title="Upload Data" 
            description="Add new documents to train your RAG models"
            icon={<Database size={24} />}
            onClick={() => navigate('/upload')}
          />
          <ActionCard 
            title="Create Model" 
            description="Configure and train a new RAG model"
            icon={<Plus size={24} />}
            onClick={handleCreateModel}
          />
          <ActionCard 
            title="Test Chat" 
            description="Try out your RAG models with the chat interface"
            icon={<MessageSquare size={24} />}
            onClick={() => navigate('/chat')}
          />
          <ActionCard 
            title="Manage Deployments" 
            description="Configure and monitor your model deployments"
            icon={<Server size={24} />}
            onClick={() => navigate('/deployments')}
          />
        </div>
      </div>
    </MainLayout>
  );
};

interface ActionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick?: () => void;
}

const ActionCard = ({ title, description, icon, onClick }: ActionCardProps) => {
  return (
    <button
      onClick={onClick}
      className="bg-white rounded-xl p-6 border border-border/40 shadow-sm hover:shadow-md transition-all duration-300 text-left flex flex-col items-start animate-scale-in"
    >
      <div className="p-3 bg-primary/10 rounded-lg text-primary mb-4">
        {icon}
      </div>
      <h3 className="font-medium mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </button>
  );
};

export default Dashboard;
