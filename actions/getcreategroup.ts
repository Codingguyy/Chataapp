"use server"
import Groupconversationodel from '@/models/groupconversation'
import { groupconversation } from "@/types/groupconversations"
import connectDB from '@/database/db_configure'
export default async function Getcreategroup(code:string){
   if(code){
    await connectDB()
    const groupconversationintnce=await Groupconversationodel.findOne({code:code}).lean()
    if(groupconversationintnce){
        return {...groupconversationintnce,groupId:groupconversationintnce._id}
    }
    else{
        return "An error occurred"
    }
   }
   return "An error occurred"
}