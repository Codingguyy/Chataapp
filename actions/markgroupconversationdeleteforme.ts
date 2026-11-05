"use server"
import Groupconversationsodel from "@/models/groupconversations"
import connectDB from "@/database/db_configure"

export default async function Markgroupconversationdeleteforme(groupId: string, globalId: string, userId: string) {
  if (!groupId || !globalId || !userId) return "Error"
  await connectDB()
  const result = await Groupconversationsodel.updateOne({ groupId, globalId }, { $addToSet: { deletedFor: userId } })
  return result.matchedCount ? "Success" : "Error"
}
