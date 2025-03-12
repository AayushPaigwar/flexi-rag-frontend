
import React, { useState } from 'react';
import { Upload, X, FileText, File, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

export type FileStatus = 'idle' | 'uploading' | 'success' | 'error';

export interface FileItem {
  id: string;
  name: string;
  size: number;
  type: string;
  status: FileStatus;
  progress: number;
  error?: string;
}

interface FileUploadProps {
  onFilesSelected?: (files: File[]) => void;
  acceptedFileTypes?: string[];
  maxFileSizeMB?: number;
  multiple?: boolean;
  disabled?: boolean;
  className?: string;
  uploadedFiles?: FileItem[];
  onRemoveFile?: (fileId: string) => void;
}

export function FileUpload({
  onFilesSelected,
  acceptedFileTypes = ['.pdf', '.txt', '.csv', '.json'],
  maxFileSizeMB = 50,
  multiple = true,
  disabled = false,
  className,
  uploadedFiles = [],
  onRemoveFile
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (disabled) return;
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    validateAndProcessFiles(droppedFiles);
  };
  
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      validateAndProcessFiles(selectedFiles);
    }
  };
  
  const validateAndProcessFiles = (files: File[]) => {
    const validFiles = files.filter(file => {
      const fileExtension = `.${file.name.split('.').pop()?.toLowerCase()}`;
      const isValidType = acceptedFileTypes.includes(fileExtension) || 
                          acceptedFileTypes.includes(file.type);
      const isValidSize = file.size <= maxFileSizeMB * 1024 * 1024;
      
      return isValidType && isValidSize;
    });
    
    if (validFiles.length > 0 && onFilesSelected) {
      onFilesSelected(validFiles);
    }
  };
  
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };
  
  return (
    <div className={className}>
      <Card className={cn(
        "border-2 border-dashed transition-all duration-200",
        isDragging ? "border-primary bg-primary/5" : "border-border",
        disabled && "opacity-60 cursor-not-allowed"
      )}>
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className="relative"
        >
          <input
            type="file"
            id="file-upload"
            multiple={multiple}
            accept={acceptedFileTypes.join(',')}
            className="sr-only"
            onChange={handleFileInputChange}
            disabled={disabled}
          />
          
          <label 
            htmlFor="file-upload"
            className={cn(
              "block cursor-pointer p-8 text-center",
              disabled && "cursor-not-allowed"
            )}
          >
            <CardHeader>
              <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Upload className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-xl">Upload Files</CardTitle>
              <CardDescription>
                Drag and drop your files here or click to browse
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Accepted file types: {acceptedFileTypes.join(', ')}
              </p>
              <p className="text-sm text-muted-foreground">
                Maximum file size: {maxFileSizeMB} MB
              </p>
            </CardContent>
          </label>
        </div>
      </Card>
      
      {uploadedFiles.length > 0 && (
        <div className="mt-4 space-y-2 animate-fade-in">
          {uploadedFiles.map((file) => (
            <div 
              key={file.id} 
              className="relative flex items-center p-3 bg-background rounded-lg border"
            >
              <div className="mr-3">
                {file.type.includes('pdf') ? (
                  <FileText className="h-6 w-6 text-red-500" />
                ) : (
                  <File className="h-6 w-6 text-blue-500" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                </div>
                
                {file.status === 'uploading' && (
                  <Progress value={file.progress} className="h-1 mt-2" />
                )}
                
                {file.status === 'error' && file.error && (
                  <div className="flex items-center mt-1 text-xs text-destructive">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {file.error}
                  </div>
                )}
              </div>
              
              <div className="ml-3 flex items-center">
                {file.status === 'success' && (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                )}
                
                {file.status === 'error' && (
                  <AlertCircle className="h-4 w-4 text-destructive" />
                )}
                
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-1 h-6 w-6"
                  onClick={() => onRemoveFile?.(file.id)}
                  disabled={disabled}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
