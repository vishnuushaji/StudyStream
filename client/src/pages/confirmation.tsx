import { useState, useEffect } from "react";
import { CheckCircle, Download, Upload, Play, Volume2, Maximize } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";

export default function ConfirmationPage() {
  const [, setLocation] = useLocation();
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideoUrl = async () => {
      try {
        const response = await apiRequest("GET", "/api/video");
        const data = await response.json();
        setVideoUrl(data.video_url);
      } catch (error) {
        console.error('Failed to fetch video URL:', error);
      }
    };

    fetchVideoUrl();
  }, []);

  const handleDownloadVideo = async () => {
    if (!videoUrl) return;

    try {
      const link = document.createElement('a');
      link.href = videoUrl;
      link.download = 'welcome-video.mp4';
      link.click();
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-muted/20 pt-16">
      <div className="flex items-center justify-center py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="text-3xl text-green-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 font-poppins">
              Registration Successful!
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Welcome to our platform! Enjoy this exclusive content as a thank you for joining us.
            </p>
          </div>

          {/* Video Section */}
          <Card className="shadow-xl mb-8 overflow-hidden">
            <div className="aspect-video relative bg-gray-900">
              {videoUrl ? (
                <video
                  controls
                  className="w-full h-full object-cover"
                  poster="https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080"
                >
                  <source src={videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                    <p>Loading video...</p>
                  </div>
                </div>
              )}
            </div>

            <CardContent className="p-8">
              <h3 className="text-2xl font-semibold text-card-foreground mb-4 font-poppins">
                Exclusive Welcome Video
              </h3>
              <p className="text-muted-foreground mb-6">
                This premium content showcases our platform's capabilities and gives you a taste of what's to come.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={handleDownloadVideo}
                  className="flex-1"
                  data-testid="button-download-video"
                >
                  <Download className="mr-2 w-4 h-4" />
                  Download Video
                </Button>
                <Button 
                  variant="secondary"
                  onClick={() => setLocation("/upload")}
                  className="flex-1"
                  data-testid="button-upload-photos"
                >
                  <Upload className="mr-2 w-4 h-4" />
                  Upload Photos
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* User Info Summary */}
          <Card>
            <CardContent className="p-6">
              <h4 className="text-lg font-semibold text-card-foreground mb-4">Registration Details</h4>
              <div className="grid sm:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Name:</span>
                  <p className="font-medium text-foreground" data-testid="text-user-name">Registration Complete</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Email:</span>
                  <p className="font-medium text-foreground" data-testid="text-user-email">Successfully Verified</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Phone:</span>
                  <p className="font-medium text-foreground" data-testid="text-user-phone">Contact Added</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
