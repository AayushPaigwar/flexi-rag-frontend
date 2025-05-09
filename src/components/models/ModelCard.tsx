import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { File, FileText, FolderOpen, MessageSquare } from "lucide-react";

export interface ModelCardProps {
  id: string;
  createdAt: string;
  document_id: string;
  className?: string;
  file_type: string;
  file_name?: string;
  onChat?: (id: string, document_id: string) => void;

  onOpen?: (id: string, document_id: string) => void;
}

export function ModelCard({
  id,
  className,
  document_id,
  file_type,
  createdAt,
  onChat,

  onOpen,
  file_name, // Add this new prop
}: ModelCardProps & { file_name?: string }) {
  // Extend the props type
  return (
    <div
      className={cn(
        "bg-white rounded-xl p-6 border border-border/40 shadow-sm hover:shadow-200 hover:shadow-lg transition-all duration-300 animate-scale-in border-gray-200",
        className
      )}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center">
          {file_type.includes("pdf") ? (
            <FileText className="h-4 w-4 text-red-500 mr-1" />
          ) : (
            <File className="h-4 w-4 text-blue-500 mr-1" />
          )}
          <p className="text-sm text-muted-foreground line-clamp-2">
            {file_name}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 text-sm">
        <span className="text-muted-foreground">Updated {createdAt}</span>
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
        <Button
          variant="default"
          size="sm"
          className="flex-1"
          onClick={() => onOpen?.(id, document_id)}
        >
          <FolderOpen size={16} className="mr-2" />
          Open
        </Button>
      </div>
    </div>
  );
}

// function StatusBadge({ status }: { status: ModelCardProps["status"] }) {
//   return (
//     <Badge
//       variant="outline"
//       className={cn(
//         "text-xs font-medium",
//         status === "deployed"
//           ? "border-green-200 bg-green-50 text-green-700"
//           : status === "training"
//           ? "border-yellow-200 bg-yellow-50 text-yellow-700"
//           : "border-gray-200 bg-gray-50 text-gray-700"
//       )}
//     >
//       {status === "deployed"
//         ? "Deployed"
//         : status === "training"
//         ? "Training"
//         : "Draft"}
//     </Badge>
//   );
// }
