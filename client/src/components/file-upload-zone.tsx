import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { CloudUpload, FolderOpen, FileImage, Weight, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadZoneProps {
  onFileSelect: (files: File[]) => void;
  accept?: string;
  maxSize?: number;
  multiple?: boolean;
  className?: string;
}

export default function FileUploadZone({
  onFileSelect,
  accept = ".png",
  maxSize = 5 * 1024 * 1024, // 5MB
  multiple = false,
  className,
}: FileUploadZoneProps) {
  const [isDragActive, setIsDragActive] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    onFileSelect(acceptedFiles);
    setIsDragActive(false);
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragAccept, isDragReject } = useDropzone({
    onDrop,
    accept: { 'image/png': ['.png'] },
    maxSize,
    multiple,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "drag-area rounded-xl p-12 text-center transition-all duration-300 cursor-pointer",
        isDragActive && "drag-over",
        isDragAccept && "border-green-500 bg-green-50",
        isDragReject && "border-red-500 bg-red-50",
        className
      )}
      data-testid="file-upload-zone"
    >
      <input {...getInputProps()} data-testid="file-input" />
      
      <div className="mb-6">
        <CloudUpload className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-card-foreground mb-2 font-poppins">
          Drop your PNG files here
        </h3>
        <p className="text-muted-foreground mb-4">
          or click to browse your files
        </p>
      </div>

      <div className="space-y-3">
        <button 
          type="button"
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 px-8 rounded-lg transition-all duration-200"
          data-testid="button-choose-files"
        >
          <FolderOpen className="w-4 h-4 mr-2 inline" />
          Choose Files
        </button>
        
        <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
          <span className="flex items-center">
            <FileImage className="w-4 h-4 mr-1" />
            PNG only
          </span>
          <span className="flex items-center">
            <Weight className="w-4 h-4 mr-1" />
            Max 5MB
          </span>
          <span className="flex items-center">
            <Shield className="w-4 h-4 mr-1" />
            Secure upload
          </span>
        </div>
      </div>
    </div>
  );
}
