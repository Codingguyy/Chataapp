"use server"
import Jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import Userodel from "@/models/userodel"
import connectDB from "@/database/db_configure"
import { getJwtSecret } from "@/lib/jwt"

type Credentials = { email: string; password: string }

export default async function Authenticate(credentials: Credentials) {
  if (!credentials?.email || !credentials?.password) return ""
  await connectDB()
  const user = await Userodel.findOne({ email: credentials.email.trim().toLowerCase() }).lean()
  if (!user || !(await bcrypt.compare(credentials.password, user.password))) return ""
  return Jwt.sign(
    { name: user.name, _id: user._id.toString() },
    getJwtSecret(),
    { expiresIn: "7h" }
  )
}
