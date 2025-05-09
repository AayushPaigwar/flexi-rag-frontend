import { StatsCard } from "@/components/dashboard/StatsCard";
import { PageHeader } from "@/components/layout/PageHeader";
import { ModelCard } from "@/components/models/ModelCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BarChart, LineChart } from "@/components/ui/chart";
import {
  mockDeploymentStats,
  mockModels,
  mockUsageStats,
} from "@/data/mock-data";
import { useToast } from "@/hooks/use-toast";
import { Clock, Database, MessageSquare, Plus, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleCreateModel = () => {
    navigate("/models/new");
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

  const chartData = {
    queries: [
      { date: "Mon", queries: 124 },
      { date: "Tue", queries: 180 },
      { date: "Wed", queries: 257 },
      { date: "Thu", queries: 198 },
      { date: "Fri", queries: 334 },
      { date: "Sat", queries: 245 },
      { date: "Sun", queries: 289 },
    ],
    usage: [
      { name: "Documents", value: 45 },
      { name: "Queries", value: 892 },
      { name: "API Calls", value: 344 },
      { name: "Models", value: 22 },
    ],
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <PageHeader
        title="Dashboard"
        description="View your documents and analytics"
        className="mb-8"
      >
        <Button onClick={() => navigate("/upload")}>
          <Plus size={16} className="mr-2" />
          Upload Data
        </Button>
      </PageHeader>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Documents"
          value={mockUsageStats.totalUploads}
          icon={<Database size={20} className="text-blue-600" />}
          trend={{ value: 25, positive: true }}
          className="bg-gradient-to-br from-white to-blue-50 border-blue-200"
        />
        <StatsCard
          title="Total Queries"
          value={mockUsageStats.totalQueries.toLocaleString()}
          icon={<MessageSquare size={20} />}
          trend={{ value: 12, positive: true }}
        />
        <StatsCard
          title="Avg Response Time"
          value={`${mockDeploymentStats.averageLatency}ms`}
          icon={<Clock size={20} />}
          trend={{ value: 8, positive: false }}
        />
        <StatsCard
          title="Success Rate"
          value={`${mockUsageStats.averagePrecision}%`}
          icon={<TrendingUp size={20} />}
          trend={{ value: 2, positive: true }}
        />
      </div>

      <div className="grid gap-8 md:grid-cols-2 mt-8">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-6">Weekly Query Volume</h3>
          <LineChart
            data={chartData.queries}
            categories={["queries"]}
            index="date"
            colors={["#0ea5e9"]}
            valueFormatter={(value: number) => `${value} queries`}
            className="aspect-[4/3]"
          />
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-6">Usage Distribution</h3>
          <BarChart
            data={chartData.usage}
            index="name"
            categories={["value"]}
            colors={["#8b5cf6"]}
            valueFormatter={(value: number) => `${value}`}
            className="aspect-[4/3]"
          />
        </Card>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-6">Recent Models</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
    </div>
  );
};

export default Dashboard;
