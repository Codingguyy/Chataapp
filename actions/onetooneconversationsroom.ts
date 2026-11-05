"use server"
import Onetooneconversationsodel from '@/models/Onetooneconversation'
import { oneto1conversation } from "@/types/1to1conversations"
import { getkey } from '@/socketserver/server'
import connectDB from '@/database/db_configure'
export default async function Onetooneconversationsroom(senderId:string,recieverId:string):Promise<oneto1conversation>{
    await connectDB()
    const onetooneconversations=await Onetooneconversationsodel.findOne({chatId:getkey(senderId,recieverId)})
    if(onetooneconversations){
        return onetooneconversations
    }
    else{
        return {chatId:'',participants:["",""],status:"pending",createdAt:new Date(),deletedAt:new Date()}
    }
}