import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ENV } from "./_core/env";

const JWT_SECRET = ENV.cookieSecret || "your-secret-key-change-in-production";
const SALT_ROUNDS = 10;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateToken(adminId: number, role: string): string {
  return jwt.sign(
    { adminId, role },
    JWT_SECRET,
    { expiresIn: "24h" }
  );
}

export function verifyToken(token: string): { adminId: number; role: string } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { adminId: number; role: string };
    return decoded;
  } catch (error) {
    return null;
  }
}

export function getTokenFromRequest(req: any): string | null {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  return authHeader.substring(7);
}
