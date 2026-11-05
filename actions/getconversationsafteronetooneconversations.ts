"use server"
import Conversationsodel from '@/models/conversation'
import connectDB from '@/database/db_configure'
export default async function Getconversationsafteronetooneconversations(id:string,cursor:string,userId:string){
   if(id&&cursor){
      await connectDB()
    const conversations=await Conversationsodel.find({chatId:id,_id:{$lt:cursor},deletedFor:{$ne:userId}}).select("-deletedFor").sort({_id:-1,createdAt:-1}).limit(20).lean()
    return conversations.map(({replyTo,...conversation}:any)=>({...conversation,replyto:replyTo?{global_id:replyTo.global_id,message:replyTo.message}:undefined}))
   }
}