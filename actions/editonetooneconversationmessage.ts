"use server"
import Conversationodel from "@/models/conversation"
import connectDB from "@/database/db_configure"

export default async function Editonetooneconversationmessage(global_id: string, message: string, senderId: string) {
  if (!global_id || !message?.trim() || !senderId) return "Error"
  await connectDB()
  const conversation = await Conversationodel.findOne({ global_id, senderId })
  if (!conversation || conversation.status === "deleted") return "Error"
  conversation.message = message
  await conversation.save()
  return "Success"
}
