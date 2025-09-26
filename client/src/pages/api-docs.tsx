import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Code, Download, Play, ExternalLink, Shield } from "lucide-react";

export default function ApiDocsPage() {
  const downloadPostmanCollection = () => {
    // This would download the Postman collection JSON file
    window.open('/api/postman-collection', '_blank');
  };

  return (
    <div className="min-h-screen bg-background py-12 pt-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Code className="text-2xl text-accent" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 font-poppins">
            API Documentation
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Complete API reference for photo upload and registration endpoints.
          </p>
        </div>

        {/* API Endpoints */}
        <div className="space-y-8">
          {/* Registration Endpoint */}
          <Card className="shadow-lg">
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-semibold text-card-foreground font-poppins">Registration API</h3>
                <Badge className="bg-green-100 text-green-800">POST</Badge>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-card-foreground mb-2">Endpoint</h4>
                  <code className="bg-muted p-3 rounded-lg block text-sm font-mono" data-testid="endpoint-register">
                    POST /api/register
                  </code>
                </div>

                <div>
                  <h4 className="font-semibold text-card-foreground mb-2">Request Body</h4>
                  <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto" data-testid="request-register">
                    <code>{`{
  "name": "string",
  "email": "string",
  "phone": "string"
}`}</code>
                  </pre>
                </div>

                <div>
                  <h4 className="font-semibold text-card-foreground mb-2">Response</h4>
                  <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto" data-testid="response-register">
                    <code>{`{
  "success": true,
  "message": "Registration successful",
  "user_id": 123,
  "redirect_url": "/confirmation"
}`}</code>
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Photo Upload Endpoint */}
          <Card className="shadow-lg">
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-semibold text-card-foreground font-poppins">Photo Upload API</h3>
                <Badge className="bg-blue-100 text-blue-800">POST</Badge>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-card-foreground mb-2">Endpoint</h4>
                  <code className="bg-muted p-3 rounded-lg block text-sm font-mono" data-testid="endpoint-upload">
                    POST /api/upload-photo
                  </code>
                </div>

                <div>
                  <h4 className="font-semibold text-card-foreground mb-2">Request</h4>
                  <p className="text-muted-foreground mb-2">Content-Type: multipart/form-data</p>
                  <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto" data-testid="request-upload">
                    <code>{`FormData:
- photo: File (PNG only, max 5MB)`}</code>
                  </pre>
                </div>

                <div>
                  <h4 className="font-semibold text-card-foreground mb-2">Response</h4>
                  <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto" data-testid="response-upload">
                    <code>{`{
  "filename": "xyz.png",
  "download_url": "https://s3.amazonaws.com/bucket/signed-url",
  "expires_in_seconds": 3600
}`}</code>
                  </pre>
                </div>

                <div>
                  <h4 className="font-semibold text-card-foreground mb-2">Error Response</h4>
                  <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto" data-testid="error-upload">
                    <code>{`{
  "error": "Invalid file type. Only PNG files are allowed.",
  "code": "INVALID_FILE_TYPE"
}`}</code>
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CSV Report Endpoint */}
          <Card className="shadow-lg">
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-semibold text-card-foreground font-poppins">CSV Report API</h3>
                <Badge className="bg-purple-100 text-purple-800">GET</Badge>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-card-foreground mb-2">Endpoint</h4>
                  <code className="bg-muted p-3 rounded-lg block text-sm font-mono" data-testid="endpoint-report">
                    GET /report.csv?key=SECRET
                  </code>
                </div>

                <div>
                  <h4 className="font-semibold text-card-foreground mb-2">Parameters</h4>
                  <div className="bg-muted p-4 rounded-lg">
                    <div className="text-sm">
                      <strong>key</strong> (required): Secret authentication key
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-card-foreground mb-2">Response</h4>
                  <p className="text-muted-foreground mb-2">Content-Type: text/csv</p>
                  <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto" data-testid="response-report">
                    <code>{`id,name,email,phone,created_at,ip,user_agent
1,"John Doe","john@example.com","+1234567890","2024-01-01T00:00:00Z","192.168.1.1","Mozilla/5.0..."`}</code>
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Postman Collection */}
          <Card className="shadow-lg">
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-semibold text-card-foreground font-poppins">Postman Collection</h3>
                <ExternalLink className="text-muted-foreground" />
              </div>

              <p className="text-muted-foreground mb-6">
                Download our Postman collection to quickly test all API endpoints with pre-configured requests.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={downloadPostmanCollection}
                  className="bg-accent hover:bg-accent/90 text-accent-foreground"
                  data-testid="button-download-collection"
                >
                  <Download className="mr-2 w-4 h-4" />
                  Download Collection
                </Button>
                <Button 
                  variant="secondary"
                  data-testid="button-run-postman"
                >
                  <Play className="mr-2 w-4 h-4" />
                  Run in Postman
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Rate Limits & Security */}
          <Card className="shadow-lg">
            <CardContent className="p-8">
              <h3 className="text-2xl font-semibold text-card-foreground mb-6 font-poppins">Rate Limits & Security</h3>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-semibold text-card-foreground mb-4">Rate Limits</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Registration:</span>
                      <span className="font-medium">5 requests/minute</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Photo Upload:</span>
                      <span className="font-medium">10 requests/minute</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">CSV Report:</span>
                      <span className="font-medium">2 requests/minute</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-card-foreground mb-4">Security Features</h4>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-center">
                      <Shield className="text-green-600 mr-2 w-4 h-4" />
                      File type validation
                    </li>
                    <li className="flex items-center">
                      <Shield className="text-green-600 mr-2 w-4 h-4" />
                      Size limit enforcement
                    </li>
                    <li className="flex items-center">
                      <Shield className="text-green-600 mr-2 w-4 h-4" />
                      Signed URL expiration
                    </li>
                    <li className="flex items-center">
                      <Shield className="text-green-600 mr-2 w-4 h-4" />
                      Input sanitization
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
