import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const registrations = pgTable("registrations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  created_at: timestamp("created_at").default(sql`NOW()`).notNull(),
  ip: text("ip"),
  user_agent: text("user_agent"),
});

export const uploads = pgTable("uploads", {
  id: serial("id").primaryKey(),
  filename: text("filename").notNull(),
  original_filename: text("original_filename").notNull(),
  s3_key: text("s3_key").notNull(),
  file_size: text("file_size").notNull(),
  upload_time: timestamp("upload_time").default(sql`NOW()`).notNull(),
  ip: text("ip"),
});

export const insertRegistrationSchema = createInsertSchema(registrations).omit({
  id: true,
  created_at: true,
  ip: true,
  user_agent: true,
});

export const insertUploadSchema = createInsertSchema(uploads).omit({
  id: true,
  upload_time: true,
  ip: true,
});

export type InsertRegistration = z.infer<typeof insertRegistrationSchema>;
export type Registration = typeof registrations.$inferSelect;
export type InsertUpload = z.infer<typeof insertUploadSchema>;
export type Upload = typeof uploads.$inferSelect;

// Remove existing user schema as it's not needed for this project
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
