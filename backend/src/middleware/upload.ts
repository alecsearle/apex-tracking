import { Request } from "express";
import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";

// Configure storage for uploaded files
const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb) => {
    cb(null, "uploads/manuals/"); //Files are saved in this directory
  },

  filename: (req: Request, file: Express.Multer.File, cb) => {
    // Unique filename: assetId-timestamp.pdf
    const uniqueId = uuidv4();
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueId}-${timestamp}${ext}`);
  },
});

// File filter to accept only PDFs
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true); // Accept file
  } else {
    cb(new Error("Only PDF files are allowed")); // Reject file
  }
};

// Configure multer
export const uploadManual = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB max file size
  },
});
