-- Create registrations table
CREATE TABLE IF NOT EXISTS registrations (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    ip TEXT,
    user_agent TEXT
);

-- Create uploads table
CREATE TABLE IF NOT EXISTS uploads (
    id SERIAL PRIMARY KEY,
    filename TEXT NOT NULL,
    original_filename TEXT NOT NULL,
    s3_key TEXT NOT NULL,
    file_size TEXT NOT NULL,
    upload_time TIMESTAMP DEFAULT NOW() NOT NULL,
    ip TEXT
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_registrations_created_at ON registrations(created_at);
CREATE INDEX IF NOT EXISTS idx_registrations_email ON registrations(email);
CREATE INDEX IF NOT EXISTS idx_uploads_upload_time ON uploads(upload_time);
CREATE INDEX IF NOT EXISTS idx_uploads_s3_key ON uploads(s3_key);
