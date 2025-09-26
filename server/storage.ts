import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { registrations, uploads, type Registration, type InsertRegistration, type Upload, type InsertUpload } from "@shared/schema";
import { eq } from "drizzle-orm";

// Use the mandatory Neon PostgreSQL connection string
const connectionString = process.env.DATABASE_URL || 
  "postgresql://neondb_owner:npg_ipEL9UJAO7VM@ep-round-dawn-adtmf9sb-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

const sql = neon(connectionString);
const db = drizzle(sql);

export interface IStorage {
  createRegistration(registration: InsertRegistration, ip?: string, userAgent?: string): Promise<Registration>;
  getAllRegistrations(): Promise<Registration[]>;
  createUpload(upload: InsertUpload, ip?: string): Promise<Upload>;
  getUploadById(id: number): Promise<Upload | undefined>;
  getRecentUploads(limit?: number): Promise<Upload[]>;
}

export class DatabaseStorage implements IStorage {
  async createRegistration(registration: InsertRegistration, ip?: string, userAgent?: string): Promise<Registration> {
    const [result] = await db.insert(registrations).values({
      ...registration,
      ip,
      user_agent: userAgent,
    }).returning();
    return result;
  }

  async getAllRegistrations(): Promise<Registration[]> {
    return await db.select().from(registrations).orderBy(registrations.created_at);
  }

  async createUpload(upload: InsertUpload, ip?: string): Promise<Upload> {
    const [result] = await db.insert(uploads).values({
      ...upload,
      ip,
    }).returning();
    return result;
  }

  async getUploadById(id: number): Promise<Upload | undefined> {
    const result = await db.select().from(uploads).where(eq(uploads.id, id)).limit(1);
    return result[0];
  }

  async getRecentUploads(limit: number = 10): Promise<Upload[]> {
    return await db.select().from(uploads).orderBy(uploads.upload_time).limit(limit);
  }
}

export const storage = new DatabaseStorage();
