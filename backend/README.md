# AI Paralegal Backend - OCR API Documentation

## Overview

This backend provides OCR (Optical Character Recognition) functionality using Tesseract.js for processing images and PDF documents.

## Features

- **Single File OCR**: Process individual image or PDF files
- **Batch OCR**: Process multiple files at once
- **PDF Support**: Convert PDF pages to images for OCR processing
- **Image Support**: JPEG, PNG, GIF, BMP, TIFF formats
- **Supabase Integration**: Store extracted text in database
- **Security**: Rate limiting, CORS, and helmet protection
- **Error Handling**: Comprehensive error handling and validation

## Installation

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file with your configuration:

```env
SUPABASE_KEY=your_supabase_key_here
PORT=3000
FRONTEND_URL=http://localhost:3001
```

3. Start the server:

```bash
npm start
# or for development
npm run dev
```

## API Endpoints

### 1. Health Check

- **GET** `/api/health`
- Returns server status and OCR worker availability

### 2. Single File OCR

- **POST** `/api/ocr`
- **Content-Type**: `multipart/form-data`
- **Body**: `file` (image or PDF file)
- **Response**: Extracted text and metadata

### 3. Batch OCR

- **POST** `/api/ocr/batch`
- **Content-Type**: `multipart/form-data`
- **Body**: `files` (array of image or PDF files, max 5)
- **Response**: Array of extracted text results

## Usage Examples

### JavaScript/Fetch

```javascript
// Single file OCR
const formData = new FormData();
formData.append("file", fileInput.files[0]);

const response = await fetch("http://localhost:3000/api/ocr", {
  method: "POST",
  body: formData,
});

const result = await response.json();
console.log(result.data.extractedText);
```

### cURL

```bash
# Single file OCR
curl -X POST \
  http://localhost:3000/api/ocr \
  -F "file=@document.pdf"

# Batch OCR
curl -X POST \
  http://localhost:3000/api/ocr/batch \
  -F "files=@image1.jpg" \
  -F "files=@image2.png" \
  -F "files=@document.pdf"
```

### React/Next.js Example

```javascript
const handleFileUpload = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch("/api/ocr", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();

    if (result.success) {
      console.log("Extracted text:", result.data.extractedText);
      console.log("Word count:", result.data.wordCount);
    } else {
      console.error("OCR failed:", result.error);
    }
  } catch (error) {
    console.error("Upload failed:", error);
  }
};
```

## Response Format

### Success Response

```json
{
  "success": true,
  "data": {
    "filename": "document.pdf",
    "extractedText": "Extracted text content...",
    "wordCount": 150,
    "characterCount": 850,
    "confidence": "high"
  }
}
```

### Error Response

```json
{
  "success": false,
  "error": "Error message",
  "details": "Additional error details"
}
```

## File Limits

- **Maximum file size**: 10MB
- **Supported formats**: JPEG, PNG, GIF, BMP, TIFF, PDF
- **Batch limit**: 5 files per request
- **Rate limit**: 100 requests per 15 minutes per IP

## Error Handling

The API includes comprehensive error handling for:

- Invalid file types
- File size limits
- OCR processing errors
- Database connection issues
- Missing files

## Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: Prevents abuse
- **File Validation**: Type and size checking
- **Input Sanitization**: Prevents malicious uploads

## Development

- Uses nodemon for development
- Hot reloading enabled
- Comprehensive logging
- Graceful shutdown handling
