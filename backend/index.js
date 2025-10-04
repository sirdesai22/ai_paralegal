// Import required modules
import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { fromBuffer, fromPath } from "pdf2pic";
dotenv.config();

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Import Tesseract.js for OCR
import { createWorker } from "tesseract.js";

// Import Supabase client
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase (optional)
let supabase = null;
// console.log(process.env.SUPABASE_ANON_KEY);
// if (process.env.SUPABASE_ANON_KEY) {
const supabaseUrl = "https://zlaxjedusxwstwjetllk.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpsYXhqZWR1c3h3c3R3amV0bGxrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1NjA4ODIsImV4cCI6MjA3NTEzNjg4Mn0.F2XMoYieioq2YzIa5UUCXXbRyma20sHeEynk2mHFew0";
supabase = createClient(supabaseUrl, supabaseKey);
console.log("Supabase client initialized");
// } else {
//   console.log("Supabase key not provided - database features disabled");
// }

// Create an Express app
const app = express();

// Define a port
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3001",
    credentials: true,
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Middleware (to parse JSON)
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// File filter for images and PDFs
function fileFilter(req, file, cb) {
  const allowedMimes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/bmp",
    "image/tiff",
    "application/pdf",
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Only image files (JPEG, PNG, GIF, BMP, TIFF) and PDF files are allowed!"
      ),
      false
    );
  }
}
const storage = multer.memoryStorage(); // or multer.diskStorage(...)
const upload = multer({ storage });

// OCR Worker initialization
let ocrWorker = null;

async function initializeOCRWorker() {
  try {
    ocrWorker = await createWorker("eng");
    console.log("OCR Worker initialized successfully");
  } catch (error) {
    console.error("Failed to initialize OCR worker:", error);
  }
}

// Initialize OCR worker on startup
initializeOCRWorker();

// Basic route
app.get("/", (req, res) => {
  res.json({
    message: "AI Paralegal Backend API",
    version: "1.0.0",
    status: "simplified - OCR functionality removed",
  });
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    message: "Simplified backend - OCR functionality removed",
  });
});

app.post("/api/ocr", upload.single("file"), async (req, res) => {
  console.log("data");
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "No file uploaded",
      });
    }

    if (!ocrWorker) {
      return res.status(500).json({
        success: false,
        error: "OCR service not available",
      });
    }

    const filePath = req.file.buffer;
    const fileType = req.file.mimetype;

    console.log(req.file);

    console.log(`Processing file: ${req.file.originalname} (${fileType})`);

    let text = "";

    if (fileType === "application/pdf") {
      // Handle PDF files - convert to images first

      const convert = fromBuffer(filePath, {
        density: 100,
        saveFilename: "page",
        savePath: uploadsDir,
        format: "png",
        width: 2000,
        height: 2000,
      });

      console.log("im here");
      const results = await convert.bulk(-1, {
        responseType: "image",
      });
      for (const result of results) {
        const pageText = await ocrWorker.recognize(result.path);
        text += pageText.data.text + "\n\n";

        // Clean up temporary image file
        fs.unlinkSync(result.path);
      }
    } else {
      // Handle image files directly
      const result = await ocrWorker.recognize(filePath);
      text = result.data.text;
    }

    // Clean up uploaded file
    fs.unlinkSync(filePath);

    // Save to Supabase if configured
    if (supabase) {
      try {
        const { error } = await supabase.from("document_analysis").insert({
          filename: req.file.originalname,
          extracted_text: text,
          file_type: fileType,
          created_at: new Date().toISOString(),
        });

        if (error) {
          console.error("Supabase error:", error);
        } else {
          console.log("Document saved to Supabase successfully");
        }
      } catch (dbError) {
        console.error("Database error:", dbError);
      }
    }

    // Return JSON response with extracted text
    res.json({
      success: true,
      data: {
        filename: req.file.originalname,
        extractedText: text,
        wordCount: text.split(/\s+/).length,
        characterCount: text.length,
        confidence: text.length > 0 ? "high" : "low",
        fileType: fileType,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("OCR processing error:", error);

    // Clean up file if it exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      success: false,
      error: "Failed to process file",
      details: error.message,
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        error: "File too large. Maximum size is 10MB.",
      });
    }
  }

  console.error("Unhandled error:", error);
  res.status(500).json({
    success: false,
    error: "Internal server error",
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    error: "Endpoint not found",
  });
});

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("Shutting down gracefully...");
  if (ocrWorker) {
    await ocrWorker.terminate();
    console.log("OCR Worker terminated");
  }
  console.log("Backend shutdown complete");
  process.exit(0);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
