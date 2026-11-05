"use server"
import Conversationodel from "@/models/conversation"
import { messagestatus } from "@/types/1to1conversations"
import connectDB from "@/database/db_configure"

export default async function Markonetooneconversations(global_id: string, status: messagestatus, senderId?: string) {
  if (!global_id || !status) return "Error"
  await connectDB()
  const filter: Record<string, string> = { global_id }
  if (senderId) filter.senderId = senderId
  const conversation = await Conversationodel.findOne(filter)
  if (!conversation) return "Error"
  conversation.status = status
  await conversation.save()
  return "Success"
}
