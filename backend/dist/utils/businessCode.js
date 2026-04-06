"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateBusinessCode = generateBusinessCode;
exports.isValidBusinessCode = isValidBusinessCode;
const CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/1/I to avoid confusion
function generateBusinessCode() {
    let code = "";
    for (let i = 0; i < 4; i++) {
        code += CHARS[Math.floor(Math.random() * CHARS.length)];
    }
    return `APEX-${code}`;
}
function isValidBusinessCode(code) {
    return /^APEX-[A-Z0-9]{4}$/.test(code);
}
