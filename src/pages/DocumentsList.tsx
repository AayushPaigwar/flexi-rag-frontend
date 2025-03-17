
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getUserDocuments, ApiDocument } from '@/services/api';
import { MessageSquare, Upload, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const DocumentsList = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [documents, setDocuments] = useState<ApiDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');
  
  useEffect(() => {
    const storedUserName = localStorage.getItem('currentUserName');
    if (storedUserName) {
      setUserName(storedUserName);
    }
    
    const fetchDocuments = async () => {
      if (!userId) return;
      
      try {
        setLoading(true);
        const docs = await getUserDocuments(userId);
        setDocuments(docs);
      } catch (error) {
        toast({
          title: "Failed to fetch documents",
          description: error instanceof Error ? error.message : "An unknown error occurred",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchDocuments();
  }, [userId, toast]);
  
  const handleUpload = () => {
    navigate('/upload');
  };
  
  const handleChat = (documentId: string) => {
    navigate(`/chat/${documentId}`);
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Your Documents</h1>
          {userName && <p className="text-muted-foreground">Welcome, {userName}</p>}
        </div>
        <Button onClick={handleUpload}>
          <Upload size={16} className="mr-2" />
          Upload Document
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Your RAG Documents</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading documents...</div>
          ) : documents.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No documents found</h3>
              <p className="text-muted-foreground mb-4">
                Upload your first document to get started
              </p>
              <Button onClick={handleUpload}>
                <Upload size={16} className="mr-2" />
                Upload Document
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>File Name</TableHead>
                  <TableHead>File Type</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell className="font-medium">{doc.file_name}</TableCell>
                    <TableCell>{doc.file_type}</TableCell>
                    <TableCell>{new Date(doc.created_at).toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleChat(doc.id)}
                      >
                        <MessageSquare size={16} className="mr-2" />
                        Chat
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentsList;
