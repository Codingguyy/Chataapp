"use server"
import Groupconversationsodel from '@/models/groupconversations'
import { groupconversations } from "@/types/groupconversations"
import connectDB from '@/database/db_configure'
export default async function Getgroupconversations(globalId:string):Promise<groupconversations|string>{
    await connectDB()
    const conversation=await Groupconversationsodel.findOne({globalId:globalId}).lean()
    if(conversation){
        return conversation
    }    
    else{
        return "An error occurred"
    }
}