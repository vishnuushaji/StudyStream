import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Client for public operations (uploads, signed URLs) - only create if credentials exist
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

// Client for admin operations (if needed)
const supabaseAdmin = supabaseUrl && supabaseServiceRoleKey
  ? createClient(supabaseUrl, supabaseServiceRoleKey)
  : supabase;

const BUCKET_NAME = process.env.SUPABASE_BUCKET_NAME || 'uploads';

export class SupabaseStorageService {
  private supabase: SupabaseClient | null;

  constructor(useAdmin: boolean = false) {
    this.supabase = useAdmin ? supabaseAdmin : supabase;
  }

  async uploadFile(file: Buffer, originalFilename: string, mimeType: string): Promise<{ key: string; url: string }> {
    if (!this.supabase) {
      throw new Error('Supabase not configured. Please set SUPABASE_URL and SUPABASE_ANON_KEY environment variables.');
    }

    const fileExt = originalFilename.split('.').pop();
    const key = `uploads/${randomUUID()}.${fileExt}`;

    const { data, error } = await this.supabase.storage
      .from(BUCKET_NAME)
      .upload(key, file, {
        contentType: mimeType,
        upsert: false
      });

    if (error) {
      throw new Error(`Upload failed: ${error.message}`);
    }

    // Generate signed URL for download (expires in 1 hour)
    const { data: signedUrlData, error: signedUrlError } = await this.supabase.storage
      .from(BUCKET_NAME)
      .createSignedUrl(key, 3600); // 1 hour expiry

    if (signedUrlError) {
      throw new Error(`Failed to create signed URL: ${signedUrlError.message}`);
    }

    return {
      key,
      url: signedUrlData.signedUrl,
    };
  }

  async getSignedDownloadUrl(key: string, expiresIn: number = 3600): Promise<string> {
    if (!this.supabase) {
      throw new Error('Supabase not configured. Please set SUPABASE_URL and SUPABASE_ANON_KEY environment variables.');
    }

    const { data, error } = await this.supabase.storage
      .from(BUCKET_NAME)
      .createSignedUrl(key, expiresIn);

    if (error) {
      throw new Error(`Failed to create signed URL: ${error.message}`);
    }

    return data.signedUrl;
  }

  async uploadVideo(file: Buffer, filename: string, mimeType: string): Promise<{ key: string; url: string }> {
    if (!this.supabase) {
      throw new Error('Supabase not configured. Please set SUPABASE_URL and SUPABASE_ANON_KEY environment variables.');
    }

    const key = `videos/${filename}`;

    const { data, error } = await this.supabase.storage
      .from(BUCKET_NAME)
      .upload(key, file, {
        contentType: mimeType,
        upsert: true // Allow overwriting for videos
      });

    if (error) {
      throw new Error(`Video upload failed: ${error.message}`);
    }

    // Generate signed URL for video (longer expiry for videos)
    const { data: signedUrlData, error: signedUrlError } = await this.supabase.storage
      .from(BUCKET_NAME)
      .createSignedUrl(key, 86400); // 24 hours for videos

    if (signedUrlError) {
      throw new Error(`Failed to create video signed URL: ${signedUrlError.message}`);
    }

    return {
      key,
      url: signedUrlData.signedUrl,
    };
  }
}

export const supabaseStorageService = new SupabaseStorageService();
export const supabaseAdminStorageService = new SupabaseStorageService(true);