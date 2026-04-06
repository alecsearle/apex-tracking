"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadPdf = exports.uploadImage = void 0;
const multer_1 = __importDefault(require("multer"));
const errors_1 = require("../utils/errors");
const imageFilter = (_req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (allowed.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new errors_1.ValidationError("Only JPEG, PNG, and WebP images are allowed"));
    }
};
const pdfFilter = (_req, file, cb) => {
    if (file.mimetype === "application/pdf") {
        cb(null, true);
    }
    else {
        cb(new errors_1.ValidationError("Only PDF files are allowed"));
    }
};
/** Image upload — max 10MB, JPEG/PNG/WebP only */
exports.uploadImage = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: imageFilter,
}).single("photo");
/** PDF upload — max 20MB, PDF only */
exports.uploadPdf = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: { fileSize: 20 * 1024 * 1024 },
    fileFilter: pdfFilter,
}).single("manual");
