"use server"
import Conversationodel from '@/models/conversation'
import connectDB from '@/database/db_configure'
export default async function Getonetoonefirstconversations(id:string,userId:string){
    if(id){
        await connectDB()
        const conversations=await Conversationodel.find({chatId:id,deletedFor:{$ne:userId}}).select("-deletedFor").sort({_id:-1}).limit(20).lean()
        return conversations.map(({replyTo,...conversation}:any)=>({...conversation,replyto:replyTo?{global_id:replyTo.global_id,message:replyTo.message}:undefined}))
    }
}