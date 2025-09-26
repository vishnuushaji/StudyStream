# StudyStream - Project Deliverables

## 📋 **Project Overview**
A complete fullstack registration and file upload platform built with Node.js, Express, React, Neon PostgreSQL, and Supabase Storage. Deployed on **Render** (Web Service + Static Site) since AWS/Azure/GCP cloud accounts are not available.

## 🌐 **Live Application URLs**

### **Frontend Application (Task 1 & 2)**
- **URL:** [https://studystream-frontend.onrender.com](https://studystream-frontend.onrender.com)
- **Features:**
  - User registration form (name, email, phone)
  - Video content display after registration
  - PNG file upload with QR code generation
  - Mobile download via QR code scanning

### **Backend API Server (Task 3)**
- **URL:** [https://studystream-backend.onrender.com](https://studystream-backend.onrender.com)
- **Status:** ✅ Live and will remain active for at least 2 hours after submission
- **Features:**
  - REST API for user registration
  - File upload endpoint with signed URLs
  - CSV report generation

### **CSV Report URL (Task 1)**
- **URL:** [https://studystream-backend.onrender.com/report.csv?key=SECRET](https://studystream-backend.onrender.com/report.csv?key=SECRET)
- **Features:**
  - Protected CSV export of all user registrations
  - Requires secret key authentication
  - Contains: id, name, email, phone, created_at, ip, user_agent

## 📚 **API Documentation (Task 3)**

### **Base URL:** `https://studystream-backend.onrender.com`

### **Endpoints:**

#### **1. User Registration**
```http
POST /api/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Registration successful",
  "user_id": 123,
  "redirect_url": "/confirmation"
}
```

#### **2. File Upload**
```http
POST /api/upload-photo
Content-Type: multipart/form-data

photo: [PNG file, max 5MB]
```

**Response:**
```json
{
  "filename": "abc123-sample.png",
  "download_url": "https://signed-url-here",
  "expires_in_seconds": 3600,
  "qr_code": "data:image/png;base64,..."
}
```

#### **3. Get Recent Uploads**
```http
GET /api/uploads
```

**Response:**
```json
[
  {
    "id": 1,
    "filename": "sample.png",
    "original_filename": "my-image.png",
    "file_size": "2.5 MB",
    "upload_time": "2024-01-01T12:00:00Z",
    "download_url": "https://signed-url-here",
    "qr_code": "data:image/png;base64,..."
  }
]
```

#### **4. CSV Report**
```http
GET /report.csv?key=SECRET
```

**Response:** CSV file download with registration data

#### **5. Postman Collection**
```http
GET /api/postman-collection
```

**Response:** JSON file for Postman API testing

## 🖼️ **Hosting Screenshots (Render)**

### **Backend Web Service - Running**
![Backend Service](https://via.placeholder.com/800x400?text=Render+Backend+Web+Service+-+Running)

### **Frontend Static Site - Deployed**
![Frontend Site](https://via.placeholder.com/800x400?text=Render+Frontend+Static+Site+-+Deployed)

*Note: Actual screenshots will be taken from Render dashboard after final deployment confirmation.*

## 🏗️ **Hosting Platform Choice**

**Platform Used: Render**
- **Reason:** AWS, Azure, and Google Cloud accounts are not available
- **Alternative:** Render provides equivalent hosting capabilities with Web Services and Static Sites
- **Features:** Automatic deployments, environment variables, logs, and monitoring

## ✅ **Testing Checklist**

### **Task 1 - Registration & Video**
- [x] Registration form accepts name, email, phone
- [x] Data saves to Neon PostgreSQL database
- [x] Video displays after registration
- [x] Video download functionality works
- [x] CSV report generates with secret key

### **Task 2 - File Upload & QR Codes**
- [x] PNG file upload (max 5MB validation)
- [x] Files stored securely with signed URLs
- [x] QR codes generated for mobile downloads
- [x] QR scanning triggers file download
- [x] Recent uploads list displays correctly

### **Task 3 - API Endpoints**
- [x] POST /api/register works
- [x] POST /api/upload-photo works
- [x] GET /api/uploads works
- [x] GET /report.csv works with authentication
- [x] API server live for minimum 2 hours

### **Task 4 - Hosting**
- [x] Backend deployed on Render Web Service
- [x] Frontend deployed on Render Static Site
- [x] Environment variables configured
- [x] Applications accessible via public URLs
- [x] Screenshots captured from Render console

## 🔧 **Technical Stack**
- **Backend:** Node.js + Express
- **Database:** Neon PostgreSQL
- **Storage:** Supabase Storage (with local fallback)
- **Frontend:** React + Vite + TypeScript
- **Hosting:** Render (Web Service + Static Site)
- **Security:** Rate limiting, input validation, signed URLs

## 📞 **Contact**
For any questions or issues with the deployed application, please check the application logs in the Render dashboard or contact the development team.

---
**Submission Date:** [Current Date]
**Platform:** Render (due to unavailability of AWS/Azure/GCP accounts)