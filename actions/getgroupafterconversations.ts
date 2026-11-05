"use server"
import Groupconversationodel from '@/models/groupconversations'
import connectDB from '@/database/db_configure'
export default async function Getgroupafterconversations(groupId:string,_id:string,userId:string){
    if(groupId&&_id){
        await connectDB()
        const conversations=await Groupconversationodel.find({groupId:groupId,_id:{$lt:_id},deletedFor:{$ne:userId}}).select("-deletedFor").sort({_id:-1}).limit(20).lean()
        return conversations
    }
    else{
        return []
    }
}
