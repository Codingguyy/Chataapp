"use server"
import Groupconversationodel from '@/models/groupconversation'
import { promote } from "@/types/groupconversations"
import connectDB from '@/database/db_configure'
export default async function Editgroupmemberstatus(value:promote,changeId:string,id:string,groupId:string){
   if(value&&changeId&&id&&groupId){
    await connectDB()
    const groupconversation=await Groupconversationodel.findOne({_id:groupId})
    if(groupconversation){
        if(groupconversation.createdBy.toString()===id){
            if(value==="admin"){
                if(!groupconversation.admins.map((data:any)=>data.toString()).includes(changeId)){
                    groupconversation.admins.push(changeId)
                    await groupconversation.save()
                    return "Success"
                }
                else{
                    return "Success"
                }
            }
            else if(value==="member"){
                if(groupconversation.admins.map((data:any)=>data.toString()).includes(changeId)){
                    groupconversation.admins=groupconversation.admins.filter((data:any)=>data.toString()!==changeId)
                    await groupconversation.save()
                    return "Success"
                }
                else{
                    return "Success"
                }
            }
        }
        else if(groupconversation.createdBy.toString()===changeId){
            return "Success"
        }
        else if(groupconversation.admins.map((data:any)=>data.toString()).includes(id)){
            if(groupconversation.admins.map((data:any)=>data.toString()).includes(changeId)){
                return "Success"
            }
            else{
                if(value==="admin"){
                    groupconversation.admins.push(changeId)
                    await groupconversation.save()
                    return "Success"
                }
                else if(value==="member"){
                    return "Success"
                }
            }
        }
        else if(!groupconversation.admins.map((data:any)=>data.toString()).includes(id)){
            return "Success"
        }
    }
    else{
        return "Error"
    }
   }
}
