"use server"
import Groupconversationodel from '@/models/groupconversation'
import { groupmember } from '@/types/groupconversations'
import connectDB from '@/database/db_configure'
export default async function Editgroupleave(groupId:string,memberId:string){
    if(groupId&&memberId){
        await connectDB()
        const groupconversation=await Groupconversationodel.findOne({_id:groupId})
        if(groupconversation){
            if(groupconversation.createdBy.toString()===memberId){
                if(groupconversation.members.length===1){
                    await groupconversation.deleteOne()
                    return "Success"
                }
                else if(groupconversation.admins.length===1&&groupconversation.members.length>1){
                    groupconversation.admins=groupconversation.admins.filter((data:string)=>data.toString()!==memberId)
                    groupconversation.members=groupconversation.members.filter((data:groupmember)=>data.id!==memberId)
                    const newadminid=groupconversation.members[0].id
                    groupconversation.admins.push(newadminid)
                    groupconversation.createdBy=newadminid
                }
                else{
                    groupconversation.admins=groupconversation.admins.filter((data:string)=>data.toString()!==memberId)
                    groupconversation.members=groupconversation.members.filter((data:groupmember)=>data.id!==memberId)
                    groupconversation.createdBy=groupconversation.admins[0]
                }
            }
            else if(groupconversation.admins.map((d:any)=>d.toString()).includes(memberId)&&groupconversation.createdBy.toString()!==memberId){
               if(groupconversation.admins.length===1){
                groupconversation.admins=groupconversation.admins.filter((data:string)=>data.toString()!==memberId)
                groupconversation.members=groupconversation.members.filter((data:groupmember)=>data.id!==memberId)
                if(groupconversation.members.length>0){
                    groupconversation.admins.push(groupconversation.members[0].id)
                }
               }
               else{
                groupconversation.admins=groupconversation.admins.filter((data:string)=>data.toString()!==memberId)
                groupconversation.members=groupconversation.members.filter((data:groupmember)=>data.id!==memberId)
               }
            }
            else {
                groupconversation.members=groupconversation.members.filter((data:groupmember)=>data.id!==memberId)
            }
            await groupconversation.save()
            return "Success"
        }
        else {
            return "Error"
        }
    }
    return "Error"
}