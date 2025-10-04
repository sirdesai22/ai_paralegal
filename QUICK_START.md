# Quick Start Guide

## Backend Setup

1. **Navigate to backend directory:**

   ```bash
   cd backend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Create environment file (optional):**

   ```bash
   # Create .env file with optional Supabase configuration
   echo "PORT=3000" > .env
   echo "FRONTEND_URL=http://localhost:3001" >> .env
   echo "NODE_ENV=development" >> .env
   # Uncomment and add your Supabase key if you want database features:
   # echo "SUPABASE_KEY=your_supabase_key_here" >> .env
   ```

4. **Start the backend server:**

   ```bash
   npm start
   ```

   The server will start on `http://localhost:3000`

   **Note:** The backend will work without Supabase configuration - database features will simply be disabled.

## Frontend Setup

1. **Navigate to frontend directory:**

   ```bash
   cd frontend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Start the frontend development server:**

   ```bash
   npm run dev
   ```

   The frontend will start on `http://localhost:3001`

## Testing File Upload

1. **With Backend Running:**

   - Upload files will be processed with real OCR using Tesseract.js
   - Extracted text will be stored and displayed

2. **Without Backend (Demo Mode):**
   - Upload files will show simulated extracted text
   - Perfect for testing the UI without backend setup

## File Upload Features

✅ **Cross-Component Integration**: Files uploaded in any component appear in all others
✅ **Real-time Status Updates**: Upload progress, OCR processing, completion status
✅ **File Management**: Add, remove, select, and categorize files
✅ **OCR Processing**: Automatic text extraction from PDFs and images
✅ **Error Handling**: Graceful fallback when backend is unavailable
✅ **Persistent State**: Files remain available across component navigation

## Supported File Types

- **PDF Documents**: Full OCR processing
- **Images**: JPEG, PNG, GIF, BMP, TIFF
- **Text Files**: DOC, DOCX, TXT

## API Endpoints

- `GET /api/health` - Health check
- `POST /api/ocr` - Single file OCR processing
- `POST /api/ocr/batch` - Multiple files OCR processing
