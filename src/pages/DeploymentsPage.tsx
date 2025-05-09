import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Modal from "@/components/ui/modal";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import {
  ApiDocument,
  deployDocument,
  DeploymentResponse,
  getAvailableDocuments,
  getDeployedDocuments,
  getGeminiApiKey,
} from "@/services/api";
import { Check, Clipboard, Server } from "lucide-react";
import { useEffect, useState } from "react";

const DeploymentsPage = () => {
  const [documents, setDocuments] = useState<ApiDocument[]>([]);
  const [deployedDocs, setDeployedDocs] = useState<
    Map<string, DeploymentResponse>
  >(new Map());
  const [loading, setLoading] = useState(true);
  const [deployingId, setDeployingId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string>("");
  const [copied, setCopied] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false); // State for modal visibility
  const [modalContent, setModalContent] = useState<DeploymentResponse | null>(
    null
  ); // State for modal content
  const { toast } = useToast();

  useEffect(() => {
    const id = localStorage.getItem("currentUserId");
    if (id) {
      setUserId(id);
      fetchDocuments(id);
    }
  }, []);

  const fetchDocuments = async (userId: string) => {
    try {
      setLoading(true);
      const [availableDocs, deployedDocsResponse] = await Promise.all([
        getAvailableDocuments(userId),
        getDeployedDocuments(userId),
      ]);

      // Add console.log to debug the response
      console.log("Raw deployed docs response:", deployedDocsResponse);

      // Create Map from deployed documents array
      const deployedDocsMap = new Map<string, DeploymentResponse>();

      // Ensure deployedDocsResponse is an array and map it
      if (Array.isArray(deployedDocsResponse)) {
        deployedDocsResponse.forEach((deployment: DeploymentResponse) => {
          console.log("Processing deployment:", deployment);
          deployedDocsMap.set(deployment.document_id, {
            document_id: deployment.document_id,
            file_name: deployment.file_name,
            endpoint: deployment.endpoint,
            instructions: deployment.instructions,
            requires_api_key: deployment.requires_api_key,
          });
        });
      } else {
        console.error(
          "Deployed docs response is not an array:",
          deployedDocsResponse
        );
      }

      console.log("Final deployed docs map:", deployedDocsMap);

      // Filter available documents to exclude deployed ones
      const availableDocsFiltered = availableDocs.filter(
        (doc) => !deployedDocsMap.has(doc.id)
      );

      setDocuments(availableDocsFiltered);
      setDeployedDocs(deployedDocsMap);
    } catch (error) {
      console.error("Error fetching documents:", error);
      toast({
        title: "Error",
        description: "Failed to fetch documents. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeployDocument = async (documentId: string) => {
    try {
      setDeployingId(documentId);
      const response = await deployDocument(documentId);

      // Update the deployedDocs map with the new deployment
      setDeployedDocs((prev) => {
        const newMap = new Map(prev);
        newMap.set(documentId, response);
        return newMap;
      });

      if (response.requires_api_key) {
        setModalContent(response);
        setShowModal(true);
      } else {
        toast({
          title: "Deployment Successful",
          description: "Your document has been deployed successfully.",
        });
        setModalContent(response);
        setShowModal(true);
      }
    } catch (error) {
      console.error("Error deploying document:", error);
      toast({
        title: "Deployment Failed",
        description:
          error.message || "Failed to deploy document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeployingId(null);
    }
  };

  // Add this helper function to format the endpoint URL correctly
  const formatEndpointUrl = (endpoint: string) => {
    if (endpoint.includes("/api/v1")) {
      return endpoint;
    }
    return endpoint.replace(
      "https://flexi-rag.azurewebsites.net/",
      "https://flexi-rag.azurewebsites.net/api/v1/"
    );
  };

  const copyToClipboard = (text: string, id: string) => {
    // Format the URL before copying to clipboard
    const formattedUrl = formatEndpointUrl(text);
    navigator.clipboard.writeText(formattedUrl);
    setCopied(id);
    toast({
      title: "Copied to clipboard",
      description: "The deployment endpoint has been copied to your clipboard.",
    });
    setTimeout(() => setCopied(null), 2000);
  };

  // Add state for API key
  const [apiKey, setApiKey] = useState<string | null>(null);

  // Add this function
  const fetchApiKey = async (userId: string) => {
    try {
      const response = await getGeminiApiKey(userId);
      if (response && response.status === "success") {
        setApiKey(response.gemini_api_key);
      } else {
        setApiKey(null);
      }
    } catch (error) {
      console.error("Error fetching API key:", error);
      setApiKey(null);
    }
  };

  // Update useEffect to fetch API key
  useEffect(() => {
    const id = localStorage.getItem("currentUserId");
    if (id) {
      setUserId(id);
      fetchDocuments(id);
      fetchApiKey(id);
    }
  }, []);

  // Update the modal content to show API key
  {
    modalContent && (
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <div className="p-8">
          <h2 className="text-xl font-bold mb-6">Deployment Instructions</h2>
          <p className="mb-4">{modalContent.instructions}</p>
          {modalContent.requires_api_key ? (
            <>
              <p className="text-yellow-500 mb-2">
                Please update your Gemini API key in the API Access section to
                complete the deployment.
              </p>
              <div className="bg-gray-100 p-4 rounded-md mb-4">
                <p className="text-sm font-medium mb-2">Your Gemini API Key:</p>
                <p className="font-mono text-sm">{apiKey || "NO KEY FOUND"}</p>
              </div>
              <p className="text-sm mb-6">
                You can get your Gemini API key from{" "}
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-600 underline"
                >
                  here
                </a>
              </p>
              <div className="flex justify-end space-x-4 mt-6">
                <Button
                  onClick={() => {
                    setShowModal(false);
                    window.location.href = "/api";
                  }}
                >
                  {apiKey ? "Update Gemini API Key" : "Add Gemini API Key"}
                </Button>
                <Button variant="outline" onClick={() => setShowModal(false)}>
                  Close
                </Button>
              </div>
            </>
          ) : (
            <>
              <p className="font-mono text-sm mb-6">
                {formatEndpointUrl(modalContent.endpoint)}
              </p>
              <p className="text-green-500 mb-6">
                Your document is successfully deployed and ready for queries.
              </p>
              <div className="flex justify-end mt-6">
                <Button onClick={() => setShowModal(false)}>Close</Button>
              </div>
            </>
          )}
        </div>
      </Modal>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-3xl font-bold text-blue-500">Deployments</h1>
      <p className="text-muted-foreground">
        Deploy your documents as API endpoints and manage your deployments.
      </p>

      {loading ? (
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-4 border rounded-md">
                  <Skeleton className="h-6 w-1/4 mb-2" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Available Documents</CardTitle>
              <CardDescription>
                Select a document to deploy as an API endpoint.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {documents.length > 0 ? (
                <div className="space-y-4">
                  {documents.map((doc) => {
                    const isDeployed = deployedDocs.has(doc.id);
                    const isDeploying = deployingId === doc.id;

                    return (
                      <div
                        key={doc.id}
                        className="p-4 border rounded-md flex justify-between items-center"
                      >
                        <div>
                          <h3 className="font-medium">{doc.file_name}</h3>
                          <p className="text-sm text-muted-foreground">
                            Type: {doc.file_type} • Uploaded:{" "}
                            {new Date(doc.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <Button
                          variant={isDeployed ? "outline" : "default"}
                          onClick={() =>
                            !isDeployed && handleDeployDocument(doc.id)
                          }
                          disabled={isDeployed || isDeploying}
                        >
                          {isDeploying
                            ? "Deploying..."
                            : isDeployed
                            ? "Deployed"
                            : "Deploy"}
                        </Button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-muted-foreground">
                  You haven't uploaded any documents yet. Go to the Upload page
                  to add documents.
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Active Deployments</CardTitle>
              <CardDescription>
                Manage your deployed document endpoints.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {deployedDocs.size > 0 ? (
                <div className="space-y-4">
                  {Array.from(deployedDocs.entries()).map(
                    ([docId, deployment]) => {
                      const document = documents.find((d) => d.id === docId);

                      if (!deployment || !docId) return null; // Skip invalid entries

                      return (
                        <div key={docId} className="p-4 border rounded-md">
                          <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">
                                {document?.file_name || `Document ${docId}`}
                              </h3>
                              <Badge className="bg-green-500 hover:bg-green-600">
                                Active
                              </Badge>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                copyToClipboard(deployment.endpoint, docId)
                              }
                            >
                              {copied === docId ? (
                                <Check size={16} />
                              ) : (
                                <Clipboard size={16} />
                              )}
                            </Button>
                          </div>
                          <p className="text-sm text-muted-foreground font-mono mt-1">
                            {formatEndpointUrl(deployment.endpoint)}
                          </p>
                          {/* <div className="mt-2 flex items-center gap-2 text-sm">
                          <Globe size={14} />
                          <span>Public endpoint</span>
                          {deployment.requires_api_key === true && (
                            <div className="ml-auto flex items-center text-yellow-500">
                              <AlertTriangle size={14} className="mr-1" />
                              <span>API key required</span>
                            </div>
                          )}
                        </div> */}
                        </div>
                      );
                    }
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Server className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="font-medium text-lg">No Active Deployments</h3>
                  <p className="text-muted-foreground mt-1 max-w-md">
                    You haven't deployed any documents yet. Select a document
                    from the list above to deploy it.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Modal for deployment instructions */}
          {modalContent && (
            <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
              <div className="p-8">
                <h2 className="text-xl font-bold mb-6">
                  Deployment Instructions
                </h2>
                <p className="mb-4">{modalContent.instructions}</p>
                {modalContent.requires_api_key ? (
                  <>
                    <p className="text-yellow-500 mb-2">
                      Please update your Gemini API key in the API Access
                      section to complete the deployment.
                    </p>
                    <p className="text-sm mb-6">
                      You can get your Gemini API key from{" "}
                      <a
                        href="https://aistudio.google.com/app/apikey"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-600 underline"
                      >
                        here
                      </a>
                    </p>
                    <div className="flex justify-end space-x-4 mt-6">
                      <Button
                        onClick={() => {
                          setShowModal(false);
                          window.location.href = "/api";
                        }}
                      >
                        {apiKey
                          ? "Update Gemini API Key"
                          : "Add Gemini API Key"}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setShowModal(false)}
                      >
                        Close
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="font-mono text-sm mb-6">
                      {modalContent.endpoint}
                    </p>
                    <p className="text-green-500 mb-6">
                      Your document is successfully deployed and ready for
                      queries.
                    </p>
                    <div className="flex justify-end mt-6">
                      <Button onClick={() => setShowModal(false)}>Close</Button>
                    </div>
                  </>
                )}
              </div>
            </Modal>
          )}
        </>
      )}
    </div>
  );
};

export default DeploymentsPage;
