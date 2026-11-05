"use server"
import Groupconversationodel from '@/models/groupconversations'
import connectDB from '@/database/db_configure'
export default async function Getgroupfirstconversations(groupId:string,userId:string){
    if(groupId){
        await connectDB()
        const conversations=await Groupconversationodel.find({groupId:groupId,deletedFor:{$ne:userId}}).select("-deletedFor").sort({_id:-1}).limit(20).lean()
        return conversations
    }
    else{
        return []
    }
}