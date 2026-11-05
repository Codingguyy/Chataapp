"use server"
import Onetooneconversationsodel from '@/models/conversation'
import { conversations } from "@/types/1to1conversations"
import { getkey } from '@/socketserver/server'
import connectDB from '@/database/db_configure'
export default async function Getonetooneconversations(senderId:string,recieverId:string):Promise<conversations[]>{
    await connectDB()
    const onetooneconversations=await Onetooneconversationsodel.find({chatId:getkey(senderId,recieverId)}).lean()
    if(onetooneconversations.length){
        return onetooneconversations
    }
    else{
        return []
    }
}