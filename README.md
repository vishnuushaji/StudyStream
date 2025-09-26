# StudyStream - Fullstack Registration & Upload Platform

A complete fullstack application built with Node.js, Express, React, Neon PostgreSQL, and Supabase Storage. Features user registration, file uploads with QR codes, and CSV reporting.

## 🚀 Features

- **Landing Page & Registration**: User registration form with name, email, phone
- **Video Content**: Exclusive video content after registration with download capability
- **File Upload**: PNG image upload with QR code generation for mobile downloads
- **CSV Reports**: Protected CSV export of all registrations
- **Secure Storage**: Supabase Storage with signed URLs
- **Rate Limiting**: Protection against abuse
- **Responsive Design**: Clean, modern UI with Tailwind CSS

## 🛠 Tech Stack

- **Backend**: Node.js + Express
- **Database**: Neon PostgreSQL
- **Storage**: Supabase Storage
- **Frontend**: React + Vite + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Deployment**: Render (Web Service + Static Site)

## 📋 Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- Neon PostgreSQL database
- Render account

## 🔧 Setup Instructions

### 1. Clone and Install Dependencies

```bash
git clone <https://github.com/vishnuushaji/StudyStream.git>
cd StudyStream
npm install
```

### 2. Database Setup

The application uses Neon PostgreSQL. The database schema is automatically created via Drizzle migrations.

```bash
npm run db:push
```

### 3. Supabase Storage Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Go to Storage in your Supabase dashboard
3. Create a new bucket named `uploads`
4. Set bucket to public (or configure RLS policies as needed)
5. Get your project URL and anon key from Settings > API

### 4. Environment Variables

Create a `.env` file in the root directory:

```env
# Database (Neon PostgreSQL)
DATABASE_URL=postgresql://neondb_owner:npg_xxx@ep-xxx-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

# Supabase Storage
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_BUCKET_NAME=uploads

# Security
REPORT_SECRET_KEY=your-secret-key-here

# Server
PORT=5000
```

### 5. Local Development

```bash
# Start development server (backend + frontend)
npm run dev
```

The application will be available at `http://localhost:5000`

### 6. Build for Production

```bash
# Build the application
npm run build

# Start production server
npm start
```

## 🚀 Deployment to Render

### Backend Deployment (Web Service)

1. Go to [render.com](https://render.com) and create a new Web Service
2. Connect your GitHub repository
3. Configure the service:
   - **Runtime**: Node
   - **Build Command**: `npm ci && npm run build`
   - **Start Command**: `npm start`
4. Add environment variables in Render dashboard (same as `.env` file)
5. Deploy

### Frontend Deployment (Static Site)

1. In Render dashboard, create a new Static Site
2. Connect the same GitHub repository
3. Configure:
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
4. Add environment variable: `VITE_API_URL=https://your-backend-service.onrender.com`
5. Deploy

## 📊 API Endpoints

### Registration
- `POST /api/register` - Register a new user
- Body: `{ name: string, email: string, phone: string }`

### File Upload
- `POST /api/upload-photo` - Upload PNG image
- Content-Type: `multipart/form-data`
- Body: `photo` (PNG file, max 5MB)

### Reports
- `GET /report.csv?key=SECRET` - Download CSV report of all registrations

### Other
- `GET /api/uploads` - Get recent uploads
- `GET /api/uploads/:id/qr` - Get QR code for specific upload
- `GET /api/video` - Get video URL for confirmation page
- `GET /api/postman-collection` - Download Postman collection

## 🧪 Testing Checklist

- [ ] Register with valid details → redirects to confirmation
- [ ] Confirmation page shows video and download button
- [ ] Video download works
- [ ] Upload PNG file → shows QR code
- [ ] QR code scanning triggers download on mobile
- [ ] CSV report endpoint works with secret key
- [ ] All endpoints rate limited appropriately
- [ ] Frontend and backend deployed successfully on Render

## 🔒 Security Features

- File upload validation (PNG only, 5MB max)
- Rate limiting on sensitive endpoints
- Signed URLs with expiration
- SQL injection protection via Drizzle ORM
- CORS configuration
- Input sanitization

## 📱 Postman Collection

Import the Postman collection from `/api/postman-collection` endpoint for API testing.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 📞 Support

For issues or questions, please create an issue in the GitHub repository.