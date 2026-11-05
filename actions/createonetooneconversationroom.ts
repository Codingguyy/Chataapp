"use server"
import Onetooneconversationodel from '@/models/Onetooneconversation'
import { oneto1conversation } from '@/types/1to1conversations'
import connectDB from '@/database/db_configure'
export default async function Createonetooneconversationroom(value:oneto1conversation){
    await connectDB()
    await new Onetooneconversationodel(value).save()
}