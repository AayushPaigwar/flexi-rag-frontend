import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Upload } from "lucide-react";
import React from "react";

interface UploadButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isUploading?: boolean;
  variant?: "default" | "primary" | "outline";
}

export function UploadButton({
  children,
  className,
  isUploading = false,
  variant = "primary",
  ...props
}: UploadButtonProps) {
  return (
    <Button
      className={cn(
        "relative overflow-hidden transition-all",
        variant === "primary" && "bg-primary text-white hover:bg-primary/90",
        variant === "outline" &&
          "border-2 border-primary/20 bg-transparent text-primary hover:bg-primary/5",
        isUploading && "cursor-not-allowed",
        className
      )}
      disabled={isUploading}
      {...props}
    >
      {isUploading ? (
        <>
          <span className="absolute inset-0 flex items-center justify-center">
            <svg
              className="h-5 w-5 animate-spin text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </span>
          <span className="opacity-0">Uploading...</span>
        </>
      ) : (
        <>
          <Upload className="mr-2 h-4 w-4" />
          {children}
        </>
      )}
    </Button>
  );
}
