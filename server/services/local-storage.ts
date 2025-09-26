import { randomUUID } from "crypto";
import { writeFileSync, mkdirSync, existsSync } from "fs";
import path from "path";

const UPLOADS_DIR = path.join(process.cwd(), 'uploads');

// Ensure uploads directory exists
if (!existsSync(UPLOADS_DIR)) {
  mkdirSync(UPLOADS_DIR, { recursive: true });
}

export class LocalStorageService {
  async uploadFile(file: Buffer, originalFilename: string, mimeType: string): Promise<{ key: string; url: string }> {
    const key = `uploads/${randomUUID()}-${originalFilename}`;
    const fileName = key.split('/').pop() || originalFilename;
    const filePath = path.join(UPLOADS_DIR, fileName);
    
    // Save file to local uploads directory
    writeFileSync(filePath, file);
    
    // Generate download URL - this would be the public URL to download the file
    const downloadUrl = `${process.env.BASE_URL || 'http://localhost:5000'}/uploads/${fileName}`;
    
    return {
      key,
      url: downloadUrl,
    };
  }

  async getSignedDownloadUrl(key: string, expiresIn: number = 3600): Promise<string> {
    // For local storage, we just return the public URL (no expiration for now)
    const fileName = key.split('/').pop() || key;
    return `${process.env.BASE_URL || 'http://localhost:5000'}/uploads/${fileName}`;
  }
}

export const localStorageService = new LocalStorageService();