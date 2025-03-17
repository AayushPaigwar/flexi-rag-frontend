
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileUpload, FileItem } from '@/components/upload/FileUpload';
import { ArrowLeft, Upload as UploadIcon } from 'lucide-react';
import { uploadDocument } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

const UploadDocument = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [files, setFiles] = useState<FileItem[]>([]);
  const [uploading, setUploading] = useState(false);
  
  const userId = localStorage.getItem('currentUserId');
  
  const handleFilesSelected = (selectedFiles: File[]) => {
    // Convert File objects to FileItem objects
    const newFiles: FileItem[] = selectedFiles.map(file => ({
      id: Math.random().toString(),
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'idle',
      progress: 0
    }));
    
    setFiles(prev => [...prev, ...newFiles]);
  };
  
  const handleRemoveFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  };
  
  const handleUpload = async () => {
    if (!userId) {
      toast({
        title: "User not found",
        description: "Please create a user profile first",
        variant: "destructive"
      });
      navigate('/');
      return;
    }
    
    if (files.length === 0) {
      toast({
        title: "No files selected",
        description: "Please select at least one file to upload",
        variant: "destructive"
      });
      return;
    }
    
    setUploading(true);
    
    try {
      // Find the actual File object that matches our first FileItem
      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      if (fileInput?.files && fileInput.files.length > 0) {
        const file = fileInput.files[0];
        
        // Update file status to uploading
        setFiles(prev => {
          const updatedFiles = [...prev];
          const fileToUpdate = updatedFiles.find(f => f.name === file.name);
          if (fileToUpdate) {
            fileToUpdate.status = 'uploading';
            fileToUpdate.progress = 10; // Starting progress
          }
          return updatedFiles;
        });
        
        // Simulate progress
        const progressInterval = setInterval(() => {
          setFiles(prev => {
            return prev.map(f => {
              if (f.name === file.name && f.status === 'uploading' && f.progress < 90) {
                return { ...f, progress: f.progress + 10 };
              }
              return f;
            });
          });
        }, 500);
        
        // Actually upload the file
        const response = await uploadDocument(file, userId);
        
        clearInterval(progressInterval);
        
        // Update file status to success
        setFiles(prev => {
          return prev.map(f => {
            if (f.name === file.name) {
              return { ...f, status: 'success', progress: 100 };
            }
            return f;
          });
        });
        
        toast({
          title: "Document uploaded successfully",
          description: `${file.name} has been uploaded and processed`
        });
        
        // Navigate to documents list after a brief delay
        setTimeout(() => {
          navigate(`/documents/${userId}`);
        }, 1500);
      }
    } catch (error) {
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
      
      // Update file status to error
      setFiles(prev => {
        return prev.map(f => {
          if (f.status === 'uploading') {
            return { ...f, status: 'error', error: 'Upload failed' };
          }
          return f;
        });
      });
    } finally {
      setUploading(false);
    }
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center mb-6">
        <Button variant="outline" onClick={() => navigate(-1)} className="mr-4">
          <ArrowLeft size={16} className="mr-2" />
          Back
        </Button>
        <h1 className="text-3xl font-bold">Upload Document</h1>
      </div>
      
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Upload a Document</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FileUpload
            onFilesSelected={handleFilesSelected}
            uploadedFiles={files}
            onRemoveFile={handleRemoveFile}
            disabled={uploading}
            acceptedFileTypes={['.pdf', '.txt', '.docx', '.csv', '.xlsx', '.xls', '.json']}
          />
          
          <div className="flex justify-end mt-6">
            <Button 
              onClick={handleUpload} 
              disabled={files.length === 0 || uploading}
              className="w-full md:w-auto"
            >
              <UploadIcon size={16} className="mr-2" />
              {uploading ? 'Uploading...' : 'Upload Document'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UploadDocument;
