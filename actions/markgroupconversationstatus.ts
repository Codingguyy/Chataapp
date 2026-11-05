"use server"
import { messagestatus } from "@/types/1to1conversations";
import Groupconversationsodel from '@/models/groupconversations'
import { grpconversations } from "@/types/groupconversations";
import connectDB from "@/database/db_configure";
export default async function Markgroupconversationstatus(groupId:string,messageId:string,status:grpconversations,id:string){
    if(groupId&&messageId&&status){
        await connectDB()
        const conversation=await Groupconversationsodel.findOne({globalId:messageId,groupId:groupId})
        if(conversation){
            if((conversation.status!=="deleteforme"&&conversation.status!=="deleted")&&conversation.sendBy===id){
            conversation.status=status
            await conversation.save()
            return "Success"
            }
        }
        else{
            return "Error"
        }
    }
    return "Error"
}