"use server"
import { usertyped } from "@/types/user"
import userodel from "@/models/userodel"
import Dbconnect from "@/database/db_configure"
import bcrypt from "bcrypt"

export default async function Register(userdetails: usertyped) {
  if (!userdetails) return "Error Registering"

  const name = userdetails.name?.trim()
  const email = userdetails.email?.trim().toLowerCase()
  const password = userdetails.password

  if (!name || name.length < 2 || !email || !password || password.length < 8 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return "Error Registering"
  }

  await Dbconnect()
  const existingUser = await userodel.findOne({ $or: [{ name }, { email }] }).lean()
  if (existingUser) {
    if (existingUser.name === name && existingUser.email === email && await bcrypt.compare(password, existingUser.password)) {
      return "Already login"
    }
    return existingUser.name === name ? "Username already taken" : "Email already in use"
  }

  const passwordHash = await bcrypt.hash(password, 12)
  await new userodel({ name, email, password: passwordHash }).save()
  return "Success"
}
