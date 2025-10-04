// Import required modules
const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

// Import Tesseract.js for OCR
const { createWorker } = require("tesseract.js");

// Import Supabase client
const { createClient } = require("@supabase/supabase-js");

// Initialize Supabase (optional)
let supabase = null;
if (process.env.SUPABASE_KEY) {
  const supabaseUrl = "https://zlaxjedusxwstwjetllk.supabase.co";
  const supabaseKey = process.env.SUPABASE_KEY;
  supabase = createClient(supabaseUrl, supabaseKey);
  console.log("Supabase client initialized");
} else {
  console.log("Supabase key not provided - database features disabled");
}

// Create an Express app
const app = express();

// Define a port
const PORT = process.env.PORT || 3000;

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

// Set storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

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

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

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
    endpoints: {
      ocr: "POST /api/ocr",
      health: "GET /api/health",
    },
  });
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    ocrWorker: ocrWorker ? "ready" : "not ready",
  });
});

// OCR endpoint for image processing
app.post("/api/ocr", upload.single("file"), async (req, res) => {
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

    const filePath = req.file.path;
    const fileType = req.file.mimetype;

    console.log(`Processing file: ${req.file.originalname} (${fileType})`);

    let text = "";

    if (fileType === "application/pdf") {
      // Handle PDF files
      const pdf2pic = require("pdf2pic");
      const convert = pdf2pic.fromPath(filePath, {
        density: 100,
        saveFilename: "page",
        savePath: uploadsDir,
        format: "png",
        width: 2000,
        height: 2000,
      });

      const results = await convert.bulk(-1, { responseType: "image" });

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
    } else {
      console.log("Supabase not configured - skipping database save");
    }

    res.json({
      success: true,
      data: {
        filename: req.file.originalname,
        extractedText: text,
        wordCount: text.split(/\s+/).length,
        characterCount: text.length,
        confidence: text.length > 0 ? "high" : "low",
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

// Batch OCR endpoint for multiple files
app.post("/api/ocr/batch", upload.array("files", 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        error: "No files uploaded",
      });
    }

    if (!ocrWorker) {
      return res.status(500).json({
        success: false,
        error: "OCR service not available",
      });
    }

    const results = [];

    for (const file of req.files) {
      try {
        const filePath = file.path;
        const fileType = file.mimetype;

        let text = "";

        if (fileType === "application/pdf") {
          // Handle PDF files
          const pdf2pic = require("pdf2pic");
          const convert = pdf2pic.fromPath(filePath, {
            density: 100,
            saveFilename: "page",
            savePath: uploadsDir,
            format: "png",
            width: 2000,
            height: 2000,
          });

          const pdfResults = await convert.bulk(-1, { responseType: "image" });

          for (const result of pdfResults) {
            const pageText = await ocrWorker.recognize(result.path);
            text += pageText.data.text + "\n\n";
            fs.unlinkSync(result.path);
          }
        } else {
          // Handle image files
          const result = await ocrWorker.recognize(filePath);
          text = result.data.text;
        }

        results.push({
          filename: file.originalname,
          extractedText: text,
          wordCount: text.split(/\s+/).length,
          characterCount: text.length,
          success: true,
        });

        // Clean up file
        fs.unlinkSync(filePath);
      } catch (fileError) {
        console.error(`Error processing ${file.originalname}:`, fileError);
        results.push({
          filename: file.originalname,
          error: fileError.message,
          success: false,
        });
      }
    }

    res.json({
      success: true,
      data: {
        processedFiles: results.length,
        results: results,
      },
    });
  } catch (error) {
    console.error("Batch OCR processing error:", error);

    // Clean up any remaining files
    if (req.files) {
      req.files.forEach((file) => {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      });
    }

    res.status(500).json({
      success: false,
      error: "Failed to process batch files",
      details: error.message,
    });
  }
});

// Legacy dashboard endpoint (for backward compatibility)
app.post("/dashboard", upload.single("pdfFile"), (req, res) => {
  res.json({
    message: "PDF uploaded successfully!",
    file: req.file,
    note: "Please use /api/ocr endpoint for OCR processing",
  });
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
  process.exit(0);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`OCR endpoint available at http://localhost:${PORT}/api/ocr`);
  console.log(`Health check available at http://localhost:${PORT}/api/health`);
});
