const CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/1/I to avoid confusion

export function generateBusinessCode(): string {
  let code = "";
  for (let i = 0; i < 4; i++) {
    code += CHARS[Math.floor(Math.random() * CHARS.length)];
  }
  return `APEX-${code}`;
}

export function isValidBusinessCode(code: string): boolean {
  return /^APEX-[A-Z0-9]{4}$/.test(code);
}
