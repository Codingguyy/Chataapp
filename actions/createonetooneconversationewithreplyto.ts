"use server"
import Conversationodel from '@/models/conversation'
import { conversations } from "@/types/1to1conversations"
import connectDB from '@/database/db_configure'
export default async function Createonetooneconversationwithreplyto(value:conversations){
   await connectDB()
   await new Conversationodel(value).save()
}