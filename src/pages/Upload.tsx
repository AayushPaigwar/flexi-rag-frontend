
import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { FileUpload, FileItem } from '@/components/upload/FileUpload';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockModels, mockUploadedFiles } from '@/data/mock-data';
import { AlertCircle, FileText, Upload as UploadIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

const Upload = () => {
  const { toast } = useToast();
  const [selectedModelId, setSelectedModelId] = useState<string>('');
  const [files, setFiles] = useState<FileItem[]>(mockUploadedFiles);
  const [processingType, setProcessingType] = useState<string>('auto');
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
  
  const handleProcessFiles = () => {
    if (!selectedModelId) {
      toast({
        title: "Model required",
        description: "Please select a RAG model to process these files.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Processing started",
      description: "Your files are being processed. This may take a few minutes."
    });
  };

  return (
    <MainLayout>
      <PageHeader 
        title="Upload Data" 
        description="Upload documents to train or update your RAG models."
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <FileUpload
            onFilesSelected={handleFilesSelected}
            uploadedFiles={files}
            onRemoveFile={handleRemoveFile}
            disabled={uploadInProgress}
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
              <CardTitle>Processing Options</CardTitle>
              <CardDescription>
                Configure how your documents will be processed.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Target RAG Model
                </label>
                <Select 
                  value={selectedModelId} 
                  onValueChange={setSelectedModelId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a model" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockModels.map((model) => (
                      <SelectItem key={model.id} value={model.id}>
                        {model.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  Chunking Method
                </label>
                <Select
                  value={processingType}
                  onValueChange={setProcessingType}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto">Automatic (Recommended)</SelectItem>
                    <SelectItem value="fixed">Fixed Size Chunks</SelectItem>
                    <SelectItem value="semantic">Semantic Chunking</SelectItem>
                    <SelectItem value="hierarchical">Hierarchical Chunking</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-medium flex items-center gap-2 mb-2">
                  <FileText className="h-4 w-4" />
                  Processing Summary
                </h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>Files to process: {files.length}</li>
                  <li>Estimated chunks: {files.length * 10}</li>
                  <li>Estimated completion: ~{files.length} minute(s)</li>
                </ul>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full"
                disabled={files.length === 0 || uploadInProgress}
                onClick={handleProcessFiles}
              >
                <UploadIcon className="h-4 w-4 mr-2" />
                Process Files
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Upload;
