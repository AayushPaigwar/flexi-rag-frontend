
import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, ExternalLink, Settings, MoreHorizontal, FileText, File } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface ModelCardProps {
  id: string;
  name: string;
  description: string;
  status: 'deployed' | 'training' | 'draft';
  sources: number;
  updatedAt: string;
  url?: string;
  document_id: string;
  file_type: string;
  className?: string;
  onChat?: (id: string, document_id: string) => void;
  onEdit?: (id: string, document_id: string) => void;
  onDelete?: (id: string, document_id: string) => void;
}

export function ModelCard({
  id,
  name,
  description,
  status,
  sources,
  updatedAt,
  url,
  document_id,
  file_type,
  className,
  onChat,
  onEdit,
  onDelete
}: ModelCardProps) {
  return (
    <div className={cn(
      "bg-white rounded-xl p-6 border border-border/40 shadow-sm hover:shadow-md transition-all duration-300 animate-scale-in",
      className
    )}>
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-lg">{name}</h3>
            <StatusBadge status={status} />
          </div>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{description}</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal size={18} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onChat?.(id, document_id)}>
              <MessageSquare className="mr-2 h-4 w-4" />
              <span>Chat</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit?.(id, document_id)}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Edit</span>
            </DropdownMenuItem>
            {status === 'deployed' && url && (
              <DropdownMenuItem onClick={() => window.open(url, '_blank')}>
                <ExternalLink className="mr-2 h-4 w-4" />
                <span>View Deployment</span>
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => onDelete?.(id, document_id)}
              className="text-destructive focus:text-destructive"
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <div className="flex items-center justify-between mt-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            {file_type.includes('pdf') ? (
              <FileText className="h-4 w-4 text-red-500 mr-1" />
            ) : (
              <File className="h-4 w-4 text-blue-500 mr-1" />
            )}
            <span className="text-muted-foreground capitalize">{file_type}</span>
          </div>
          <span className="text-muted-foreground">•</span>
          <span className="text-muted-foreground">Sources: {sources}</span>
        </div>
        <span className="text-muted-foreground">Updated {updatedAt}</span>
      </div>
      
      <div className="flex gap-2 mt-4">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1"
          onClick={() => onChat?.(id, document_id)}
        >
          <MessageSquare size={16} className="mr-2" />
          Chat
        </Button>
        {status === 'deployed' && url ? (
          <Button 
            variant="default" 
            size="sm" 
            className="flex-1"
            onClick={() => window.open(url, '_blank')}
          >
            <ExternalLink size={16} className="mr-2" />
            Open
          </Button>
        ) : (
          <Button 
            variant="default" 
            size="sm" 
            className="flex-1"
            onClick={() => onEdit?.(id, document_id)}
          >
            <Settings size={16} className="mr-2" />
            Configure
          </Button>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: ModelCardProps['status'] }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "text-xs font-medium",
        status === 'deployed' ? "border-green-200 bg-green-50 text-green-700" :
        status === 'training' ? "border-yellow-200 bg-yellow-50 text-yellow-700" :
        "border-gray-200 bg-gray-50 text-gray-700"
      )}
    >
      {status === 'deployed' ? 'Deployed' : 
       status === 'training' ? 'Training' : 'Draft'}
    </Badge>
  );
}
