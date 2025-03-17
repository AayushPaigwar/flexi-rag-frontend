
import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { FileUpload, FileItem } from '@/components/upload/FileUpload';
import { Button } from '@/components/ui/button';
import { AlertCircle, FileText, Upload as UploadIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { mockCurrentUser, mockUploadedFiles } from '@/data/mock-data';

const Upload = () => {
  const { toast } = useToast();
  const [files, setFiles] = useState<FileItem[]>(mockUploadedFiles);
  const [uploadInProgress, setUploadInProgress] = useState<boolean>(false);
  
  const handleFilesSelected = (selectedFiles: File[]) => {
    // Convert File objects to FileItem objects
    const newFiles: FileItem[] = selectedFiles.map(file => ({
      id: Math.random().toString(),
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'uploading',
      progress: 0
    }));
    
    setFiles(prev => [...prev, ...newFiles]);
    
    // Simulate upload progress
    setUploadInProgress(true);
    
    // Simulate progress updates
    newFiles.forEach(fileItem => {
      const progressInterval = setInterval(() => {
        setFiles(prev => {
          const updatedFiles = [...prev];
          const fileIndex = updatedFiles.findIndex(f => f.id === fileItem.id);
          
          if (fileIndex >= 0) {
            const file = updatedFiles[fileIndex];
            let newProgress = file.progress + 10 + Math.random() * 15;
            
            if (newProgress >= 100) {
              newProgress = 100;
              file.status = 'success';
              clearInterval(progressInterval);
              
              // Check if all files have completed
              const allDone = updatedFiles.every(f => 
                f.status === 'success' || f.status === 'error'
              );
              
              if (allDone) {
                setUploadInProgress(false);
                toast({
                  title: "Files uploaded successfully",
                  description: "Your files have been uploaded and are being processed."
                });
              }
            }
            
            file.progress = newProgress;
            updatedFiles[fileIndex] = { ...file };
          }
          
          return updatedFiles;
        });
      }, 500 + Math.random() * 500);
    });
  };
  
  const handleRemoveFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  };
  
  const handleUploadFiles = () => {
    // In a real implementation, this would call the API endpoint:
    // POST /documents/upload/ with user_id and file
    toast({
      title: "Processing started",
      description: "Your files are being processed. This may take a few minutes."
    });
  };

  return (
    <MainLayout>
      <PageHeader 
        title="Upload Documents" 
        description="Upload documents to create new RAG models."
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <FileUpload
            onFilesSelected={handleFilesSelected}
            uploadedFiles={files}
            onRemoveFile={handleRemoveFile}
            disabled={uploadInProgress}
            acceptedFileTypes={['.pdf', '.txt', '.docx', '.csv', '.xlsx', '.xls', '.json']}
          />
          
          <div className="mt-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Processing Information</AlertTitle>
              <AlertDescription>
                Files will be automatically chunked and embedded for retrieval. Large files may take several minutes to process.
              </AlertDescription>
            </Alert>
          </div>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Upload Options</CardTitle>
              <CardDescription>
                Your documents will be processed for RAG.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-medium flex items-center gap-2 mb-2">
                  <FileText className="h-4 w-4" />
                  Upload Summary
                </h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>User: {mockCurrentUser.name}</li>
                  <li>User ID: {mockCurrentUser.id}</li>
                  <li>Files to upload: {files.length}</li>
                  <li>Supported formats: PDF, TXT, DOCX, CSV, XLSX, XLS, JSON</li>
                  <li>Estimated processing time: ~{files.length} minute(s)</li>
                </ul>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">
                  After upload, your documents will be:
                </p>
                <ul className="text-sm list-disc list-inside text-muted-foreground mt-2">
                  <li>Chunked into smaller sections</li>
                  <li>Embedded using text-embedding models</li>
                  <li>Indexed for fast retrieval</li>
                  <li>Available for querying via chat interface</li>
                </ul>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full"
                disabled={files.length === 0 || uploadInProgress}
                onClick={handleUploadFiles}
              >
                <UploadIcon className="h-4 w-4 mr-2" />
                Upload Documents
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Upload;
