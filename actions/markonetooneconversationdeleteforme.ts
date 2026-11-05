"use server"
import Conversationodel from "@/models/conversation"
import connectDB from "@/database/db_configure"

export default async function Markonetooneconversationdeleteforme(chatId: string, globalId: string, userId: string) {
  if (!chatId || !globalId || !userId) return "Error"
  await connectDB()
  const result = await Conversationodel.updateOne({ chatId, global_id: globalId }, { $addToSet: { deletedFor: userId } })
  return result.matchedCount ? "Success" : "Error"
}
