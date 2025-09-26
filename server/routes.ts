import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { s3Service } from "./services/s3";
import { qrService } from "./services/qr";
import { uploadMiddleware, handleUploadError } from "./middleware/upload";
import { insertRegistrationSchema } from "@shared/schema";
import { stringify } from "csv-stringify";
import rateLimit from "express-rate-limit";

// Rate limiting middleware
const registrationLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // 5 requests per minute
  message: { error: 'Too many registration attempts, please try again later.' }
});

const uploadLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 requests per minute
  message: { error: 'Too many upload attempts, please try again later.' }
});

const reportLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 2, // 2 requests per minute
  message: { error: 'Too many report requests, please try again later.' }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Registration endpoint
  app.post("/api/register", registrationLimiter, async (req, res) => {
    try {
      const validatedData = insertRegistrationSchema.parse(req.body);
      const ip = req.ip || req.connection.remoteAddress;
      const userAgent = req.get('User-Agent');
      
      const registration = await storage.createRegistration(validatedData, ip, userAgent);
      
      res.json({
        success: true,
        message: "Registration successful",
        user_id: registration.id,
        redirect_url: "/confirmation"
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(400).json({
        error: "Invalid registration data",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Photo upload endpoint
  app.post("/api/upload-photo", uploadLimiter, uploadMiddleware.single('photo'), handleUploadError, async (req: any, res: any) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          error: "No file uploaded",
          code: "NO_FILE"
        });
      }

      const { buffer, originalname, mimetype, size } = req.file;
      const ip = req.ip || req.connection.remoteAddress;
      
      // Upload to S3
      const { key, url } = await s3Service.uploadFile(buffer, originalname, mimetype);
      
      // Save upload record to database
      const upload = await storage.createUpload({
        filename: key.split('/').pop() || originalname,
        original_filename: originalname,
        s3_key: key,
        file_size: (size / 1024 / 1024).toFixed(2) + ' MB',
      }, ip);

      res.json({
        filename: upload.filename,
        download_url: url,
        expires_in_seconds: 3600
      });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({
        error: "Upload failed",
        code: "UPLOAD_ERROR"
      });
    }
  });

  // Get recent uploads
  app.get("/api/uploads", async (req, res) => {
    try {
      const uploads = await storage.getRecentUploads(10);
      
      // Generate fresh signed URLs for each upload
      const uploadsWithUrls = await Promise.all(
        uploads.map(async (upload) => {
          const downloadUrl = await s3Service.getSignedDownloadUrl(upload.s3_key);
          const qrCode = await qrService.generateQRCode(downloadUrl);
          
          return {
            ...upload,
            download_url: downloadUrl,
            qr_code: qrCode,
          };
        })
      );
      
      res.json(uploadsWithUrls);
    } catch (error) {
      console.error('Get uploads error:', error);
      res.status(500).json({ error: "Failed to fetch uploads" });
    }
  });

  // Generate QR code for upload
  app.get("/api/uploads/:id/qr", async (req, res) => {
    try {
      const uploadId = parseInt(req.params.id);
      const upload = await storage.getUploadById(uploadId);
      
      if (!upload) {
        return res.status(404).json({ error: "Upload not found" });
      }
      
      const downloadUrl = await s3Service.getSignedDownloadUrl(upload.s3_key);
      const qrCode = await qrService.generateQRCode(downloadUrl);
      
      res.json({
        qr_code: qrCode,
        download_url: downloadUrl,
        expires_in_seconds: 3600
      });
    } catch (error) {
      console.error('QR generation error:', error);
      res.status(500).json({ error: "Failed to generate QR code" });
    }
  });

  // CSV Report endpoint with secret key protection
  app.get("/report.csv", reportLimiter, async (req, res) => {
    try {
      const secretKey = req.query.key;
      const expectedKey = process.env.REPORT_SECRET_KEY || "SECRET";
      
      if (!secretKey || secretKey !== expectedKey) {
        return res.status(401).json({ error: "Unauthorized: Invalid secret key" });
      }
      
      const registrations = await storage.getAllRegistrations();
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="registrations.csv"');
      
      const stringifier = stringify({
        header: true,
        columns: {
          id: 'id',
          name: 'name',
          email: 'email', 
          phone: 'phone',
          created_at: 'created_at',
          ip: 'ip',
          user_agent: 'user_agent'
        }
      });
      
      stringifier.pipe(res);
      
      registrations.forEach(registration => {
        stringifier.write(registration);
      });
      
      stringifier.end();
    } catch (error) {
      console.error('CSV report error:', error);
      res.status(500).json({ error: "Failed to generate report" });
    }
  });

  // Serve Postman collection
  app.get("/api/postman-collection", (req, res) => {
    res.sendFile(process.cwd() + "/postman/api-collection.json");
  });

  const httpServer = createServer(app);
  return httpServer;
}
