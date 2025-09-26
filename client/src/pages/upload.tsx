import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import FileUploadZone from "@/components/file-upload-zone";
import { Camera, Check, Download, Copy, QrCode, FileImage } from "lucide-react";

interface UploadResult {
  filename: string;
  download_url: string;
  expires_in_seconds: number;
  qr_code?: string;
}

interface UploadWithMetadata extends UploadResult {
  id: number;
  original_filename: string;
  file_size: string;
  upload_time: string;
  qr_code?: string;
}

export default function UploadPage() {
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('photo', file);
      
      const response = await apiRequest("POST", "/api/upload-photo", formData);
      return response.json();
    },
    onSuccess: (data: UploadResult) => {
      setUploadResult(data);
      setUploadProgress(null);
      toast({
        title: "Upload Successful!",
        description: "Your image has been uploaded and is ready for download.",
      });
      // Invalidate uploads cache to refresh the list
      queryClient.invalidateQueries({ queryKey: ["/api/uploads"] });
    },
    onError: (error) => {
      setUploadProgress(null);
      toast({
        title: "Upload Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const { data: uploads = [] } = useQuery<UploadWithMetadata[]>({
    queryKey: ["/api/uploads"],
  });

  const handleFileSelect = (files: File[]) => {
    if (files.length === 0) return;
    
    const file = files[0];
    
    // Validate file type
    if (!file.type.includes('png')) {
      toast({
        title: "Invalid File Type",
        description: "Please upload PNG files only.",
        variant: "destructive",
      });
      return;
    }
    
    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "File size must be less than 5MB.",
        variant: "destructive",
      });
      return;
    }
    
    // Start upload with progress simulation
    setUploadProgress(0);
    setUploadResult(null);
    
    // Simulate progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev === null) return null;
        const newProgress = prev + Math.random() * 20;
        if (newProgress >= 95) {
          clearInterval(progressInterval);
          return 95; // Let the actual upload completion set it to 100
        }
        return newProgress;
      });
    }, 200);
    
    uploadMutation.mutate(file);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: "Download link copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy to clipboard.",
        variant: "destructive",
      });
    }
  };

  const downloadFile = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
  };

  return (
    <div className="min-h-screen bg-background py-12 pt-28">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Camera className="text-2xl text-secondary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 font-poppins">
            Upload Your Photos
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Upload PNG images (max 5MB) and get instant QR codes for easy mobile downloads.
          </p>
        </div>

        {/* Upload Section */}
        <Card className="shadow-xl mb-8">
          <CardContent className="p-8">
            <FileUploadZone onFileSelect={handleFileSelect} />

            {/* Upload Progress */}
            {uploadProgress !== null && (
              <div className="mt-6">
                <div className="bg-muted rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">Uploading...</span>
                    <span className="text-sm text-muted-foreground">{Math.round(uploadProgress)}%</span>
                  </div>
                  <Progress value={uploadProgress} className="w-full" />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upload Results */}
        {uploadResult && (
          <Card className="shadow-xl mb-8">
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-semibold text-card-foreground font-poppins">
                  Upload Successful!
                </h3>
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Check className="text-green-600" />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {/* File Info */}
                <div>
                  <h4 className="text-lg font-semibold text-card-foreground mb-4">File Details</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Filename:</span>
                      <span className="font-medium text-foreground" data-testid="text-filename">
                        {uploadResult.filename}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Expires:</span>
                      <span className="font-medium text-foreground" data-testid="text-expires">
                        In {Math.floor(uploadResult.expires_in_seconds / 60)} minutes
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 space-y-3">
                    <Button 
                      onClick={() => downloadFile(uploadResult.download_url, uploadResult.filename)}
                      className="w-full"
                      data-testid="button-download-image"
                    >
                      <Download className="mr-2 w-4 h-4" />
                      Download Image
                    </Button>
                    <Button 
                      variant="secondary"
                      onClick={() => copyToClipboard(uploadResult.download_url)}
                      className="w-full"
                      data-testid="button-copy-url"
                    >
                      <Copy className="mr-2 w-4 h-4" />
                      Copy Download Link
                    </Button>
                  </div>
                </div>

                {/* QR Code */}
                <div className="text-center">
                  <h4 className="text-lg font-semibold text-card-foreground mb-4">Mobile Download</h4>
                  <div className="bg-white p-6 rounded-xl border border-border inline-block mb-4">
                    {uploadResult.qr_code ? (
                      <img
                        src={uploadResult.qr_code}
                        alt="QR Code for download"
                        className="w-40 h-40"
                      />
                    ) : (
                      <div className="w-40 h-40 bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center">
                        <div className="text-center">
                          <QrCode className="text-4xl text-gray-400 mb-2 mx-auto" />
                          <p className="text-xs text-gray-500">Generating...</p>
                        </div>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Scan this QR code with your phone to download the image directly to your device.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Uploads */}
        <div>
          <h3 className="text-xl font-semibold text-foreground mb-4 font-poppins">Recent Uploads</h3>
          <Card>
            {uploads.length === 0 ? (
              <CardContent className="p-8 text-center">
                <FileImage className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No uploads yet. Upload your first image to get started!</p>
              </CardContent>
            ) : (
              uploads.map((upload, index) => (
                <div 
                  key={upload.id} 
                  className="p-4 border-b border-border last:border-b-0 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                        <FileImage className="text-muted-foreground w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium text-card-foreground" data-testid={`text-upload-filename-${index}`}>
                          {upload.original_filename}
                        </p>
                        <p className="text-sm text-muted-foreground" data-testid={`text-upload-details-${index}`}>
                          Uploaded recently • {upload.file_size}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => downloadFile(upload.download_url, upload.filename)}
                        data-testid={`button-download-${index}`}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(upload.qr_code, '_blank')}
                        data-testid={`button-qr-${index}`}
                      >
                        <QrCode className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
