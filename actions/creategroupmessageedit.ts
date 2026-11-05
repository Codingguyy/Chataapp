"use server"
import Groupconversationsodel from '@/models/groupconversations'
import connectDB from '@/database/db_configure'
export default async function Creategroupmessageedit(groupId:string,globalId:string,id:string,message:string){
    if(groupId&&globalId&&id&&message){
        await connectDB()
        const groupconversation=await Groupconversationsodel.findOne({globalId:globalId,groupId:groupId})
        if(groupconversation){
            if((groupconversation.status!=="deleteforme"&&groupconversation.status!=="deleted")&&groupconversation.sendBy===id){
            groupconversation.message=message
            await groupconversation.save()
            return "Success"
            }
        }
        else{
            return "Error"
        }
    }
    return "Error"
}