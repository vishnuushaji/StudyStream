# FoodTech Platform

## Overview

This is a full-stack web application built for FoodTech Platform featuring user registration, photo upload capabilities, and comprehensive API endpoints. The application provides a landing page for user registration with confirmation flow, photo upload functionality with QR code generation for mobile downloads, and a complete API for programmatic access. The system is designed to handle file storage, user data management, and provide comprehensive reporting capabilities.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **UI Components**: Radix UI primitives with shadcn/ui component library for consistent design system
- **Styling**: Tailwind CSS with custom CSS variables for theming support
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Forms**: React Hook Form with Zod validation for type-safe form handling

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ESM modules
- **API Design**: RESTful endpoints with comprehensive error handling and rate limiting
- **Middleware**: Custom logging, CORS support, file upload handling with Multer
- **Input Validation**: Zod schemas for request/response validation
- **Development**: Hot reload with Vite integration in development mode

### Data Storage Solutions
- **Primary Database**: PostgreSQL via Neon serverless database
- **ORM**: Drizzle ORM for type-safe database operations
- **File Storage**: AWS S3 with signed URL generation for secure file access
- **Schema Management**: Drizzle migrations for database versioning

### Authentication and Authorization
- **Session Management**: Express sessions with PostgreSQL store (connect-pg-simple)
- **Rate Limiting**: Express rate limiting for API endpoints (different limits for registration, upload, and reporting)
- **Security**: IP address and user agent tracking for audit purposes

### External Service Integrations
- **AWS S3**: File storage with bucket management and signed URL generation
- **QR Code Generation**: QRCode library for generating downloadable QR codes
- **CSV Export**: csv-stringify for data export functionality
- **Email**: Ready for integration with email service providers for notifications

## External Dependencies

### Cloud Infrastructure
- **Database**: Neon PostgreSQL serverless database with connection pooling
- **File Storage**: AWS S3 for secure file storage and retrieval
- **Hosting**: Configured for cloud deployment (AWS/GCP/Azure compatible)

### Third-Party Services
- **AWS SDK**: S3 client and request presigner for file operations
- **Neon Database**: Serverless PostgreSQL with HTTP-based connections
- **Drizzle ORM**: Database toolkit with PostgreSQL dialect support

### Development and Build Tools
- **Vite**: Frontend build tool with React plugin and development server
- **TypeScript**: Full type safety across frontend, backend, and shared code
- **ESBuild**: Backend bundling for production deployments
- **PostCSS**: CSS processing with Tailwind CSS and Autoprefixer

### API Documentation
- **Postman Collection**: Complete API documentation with example requests and responses
- **OpenAPI**: Ready for OpenAPI/Swagger documentation integration