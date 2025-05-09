import { StatsCard } from "@/components/dashboard/StatsCard";
import { PageHeader } from "@/components/layout/PageHeader";
import { ModelCard } from "@/components/models/ModelCard";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { FileText, Plus, Server } from "lucide-react";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [documentCount, setDocumentCount] = useState(0);
  const [deployedApisCount, setDeployedApisCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [documents, setDocuments] = useState([]);
  const [isLoadingModels, setIsLoadingModels] = useState(false);
  const userId = localStorage.getItem("currentUserId") || "";

  // Add state for stats data
  const [totalQueries, setTotalQueries] = useState(0);
  const [avgResponseTime, setAvgResponseTime] = useState(0);
  const [successRate, setSuccessRate] = useState(0);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `https://flexi-rag.azurewebsites.net/api/v1/users/${userId}/documents`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch documents");
        }

        const data = await response.json();
        setDocumentCount(data.length || 0);
        setDocuments(data);

        // Calculate stats based on the documents data
        // For this example, we'll use the document count to derive some stats
        // In a real application, you would fetch these from dedicated API endpoints
        setTotalQueries(data.length * 15); // Example: 15 queries per document on average
        setAvgResponseTime(Math.floor(200 + Math.random() * 300)); // Random value between 200-500ms
        setSuccessRate(Math.floor(85 + Math.random() * 10)); // Random value between 85-95%
      } catch (error) {
        console.error("Error fetching documents:", error);
        toast({
          title: "Error",
          description: "Failed to fetch document count",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    const fetchDeployedApis = async () => {
      try {
        const response = await fetch(
          "https://flexi-rag.azurewebsites.net/api/v1/documents/deployed",
          {
            method: "POST",
            headers: {
              accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              user_id: userId,
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch deployed APIs");
        }

        const data = await response.json();
        setDeployedApisCount(data.length || 0);
      } catch (error) {
        console.error("Error fetching deployed APIs:", error);
        // Don't show toast for this error to avoid multiple error messages
      }
    };

    fetchDocuments();
    if (userId) {
      fetchDeployedApis();
    }
  }, [toast, userId]);

  const handleChatWithModel = (id: string, document_id: string) => {
    console.log("Chat with model:", document_id);

    //save the document_id to local storage
    localStorage.setItem("currentDocumentId", document_id);

    // Navigate to chat with the document ID
    navigate(`/chat/${document_id}`);
  };

  const handleOpenDocument = () => {
    // Navigate to documents section with the document ID
    navigate(`/documents/${userId}`);
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
      { name: "Documents", value: documentCount || 0 },
      { name: "Queries", value: totalQueries || 0 },
      { name: "API Calls", value: Math.floor(totalQueries * 0.4) || 0 },
      { name: "Models", value: Math.floor(documentCount * 0.5) || 0 },
    ],
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto p-8">
      <PageHeader
        title="Dashboard"
        description="View your documents and analytics"
        className="mb-8"
      >
        <Button
          onClick={() => navigate("/upload")}
          className="text-blue-600 bg-blue-100 hover:bg-blue-200"
        >
          <Plus size={16} className="mr-2" />
          Upload Data
        </Button>
      </PageHeader>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Documents"
          value={
            isLoading ? (
              <div className="w-12 h-6 bg-gradient-to-r from-blue-100 to-blue-200 animate-pulse rounded" />
            ) : (
              documentCount.toString()
            )
          }
          icon={<FileText size={20} />}
          className="relative before:absolute before:inset-0 before:rounded-lg before:border-2 before:border-blue-400/50 before:animate-[border-dance_4s_linear_infinite]"
        />
        <StatsCard
          title="Deployed APIs"
          value={
            isLoading ? (
              <div className="w-12 h-6 bg-gradient-to-r from-blue-100 to-blue-200 animate-pulse rounded" />
            ) : (
              deployedApisCount.toString()
            )
          }
          icon={<Server size={20} />}
          className="relative before:absolute before:inset-0 before:rounded-lg before:border-2 before:border-green-400/50 before:animate-[border-dance_4s_linear_infinite]"
        />
      </div>

      <div className="mt-8 border border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-6">Recent Documents</h2>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-6 border border-border/40 shadow-sm h-[200px] animate-pulse border-gray-200"
              ></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documents.map((doc) => (
              <ModelCard
                key={doc.id}
                id={userId}
                document_id={doc.id}
                file_type={doc.file_type}
                file_name={doc.file_name}
                createdAt={new Date(doc.created_at).toLocaleDateString()}
                onChat={handleChatWithModel}
                onOpen={handleOpenDocument}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
