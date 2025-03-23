import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { addGeminiApiKey, getGeminiApiKey } from '@/services/api';
import { Check, Clipboard, Key, RefreshCw } from "lucide-react";
import { useEffect, useState } from 'react';

const ApiPage = () => {
  const [apiKey, setApiKey] = useState<string>("");
  const [newApiKey, setNewApiKey] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState<string>("");
  const [showApiKey, setShowApiKey] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const id = localStorage.getItem('currentUserId');
    console.log('Current User ID:', id);
    
    if (id) {
      setUserId(id);
      // Fetch the actual API key
      const fetchApiKey = async () => {
        try {
          console.log('Fetching API key for user:', id);
          const response = await getGeminiApiKey(id);
          console.log('API Key Response:', response);
          
          if (response.status === 'success') {
            console.log('Setting API key:', response.gemini_api_key);
            setApiKey(response.gemini_api_key);
          } else {
            console.log('No API key found in response');
            setApiKey("");
          }
        } catch (error) {
          console.error("Error fetching API key:", error);
          setApiKey("");
        }
      };
      fetchApiKey();
    } else {
      console.log('No user ID found in localStorage');
    }
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast({
      title: "Copied to clipboard",
      description: "The API key has been copied to your clipboard.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveApiKey = async () => {
    if (!newApiKey.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid API key",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsLoading(true);
      await addGeminiApiKey(userId, newApiKey);
      setApiKey(newApiKey);
      setNewApiKey("");
      toast({
        title: "API Key Saved",
        description: "Your Gemini API key has been saved successfully.",
      });
    } catch (error) {
      console.error("Error saving API key:", error);
      toast({
        title: "Error",
        description: "Failed to save API key. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-3xl font-bold">API Access</h1>
      <p className="text-muted-foreground">
        Manage your Gemini API key for document deployments.
      </p>
      
      <Card>
        <CardHeader>
          <CardTitle>Your Gemini API Key</CardTitle>
          <CardDescription>
            This API key is used for document deployments and queries.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {apiKey ? (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Input 
                  value={apiKey} 
                  readOnly 
                  type={showApiKey ? "text" : "password"}
                  className="font-mono"
                />
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => copyToClipboard(apiKey)}
                >
                  {copied ? <Check size={16} /> : <Clipboard size={16} />}
                </Button>
              </div>
              <Button 
                variant="outline" 
                onClick={() => setShowApiKey(!showApiKey)}
                className="text-sm"
              >
                {showApiKey ? "Hide API Key" : "Show API Key"}
              </Button>
            </div>
          ) : (
            <p className="text-muted-foreground">
              You haven't added a Gemini API key yet. Add one below to enable document deployments.
            </p>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>{apiKey ? "Update" : "Add"} Gemini API Key</CardTitle>
          <CardDescription>
            {apiKey 
              ? "Update your existing Gemini API key" 
              : "Add your Gemini API key to enable document deployments"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Input
              placeholder="Enter your Gemini API key"
              value={newApiKey}
              onChange={(e) => setNewApiKey(e.target.value)}
              type="password"
            />
            <p className="text-sm text-muted-foreground">
              You can get a Gemini API key from the <a href="https://ai.google.dev/gemini-api/docs/api-key" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google AI Studio</a>.
            </p>
          </div>
          <Button 
            onClick={handleSaveApiKey} 
            disabled={isLoading || !newApiKey.trim()}
            className="flex items-center gap-2"
          >
            {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Key size={16} />}
            {apiKey ? "Update API Key" : "Save API Key"}
          </Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>API Usage Instructions</CardTitle>
          <CardDescription>
            How to use your API key with deployed documents
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-muted p-4 rounded-md overflow-x-auto">
            <pre className="text-sm">
{`// Example using fetch
fetch("https://flexi-rag.azurewebsites.net/api/v1/deployed/{document_id}", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    query: "What are the main points in the document?",
  })
})
.then(response => response.json())
.then(data => console.log(data));`}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApiPage;
