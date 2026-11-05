import jwt from "jsonwebtoken"

export function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET
  if (!secret || secret.length < 32) {
    throw new Error("JWT_SECRET must be set to a random string of at least 32 characters")
  }
  return secret
}

export function verifyAuthToken(token: string): { name: string; _id: string } {
  const decoded = jwt.verify(token, getJwtSecret())
  if (typeof decoded === "string" || !decoded._id || !decoded.name) {
    throw new Error("Invalid authentication token")
  }
  return { name: String(decoded.name), _id: String(decoded._id) }
}
