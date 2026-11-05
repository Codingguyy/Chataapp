"use server"
import Groupconversationodel from '@/models/groupconversation'
import { groupmember } from '@/types/groupconversations'
import connectDB from '@/database/db_configure'
export default async function Editgroupkickmember(groupId:string,memberId:string,kickerId:string){
    if(groupId&&memberId&&kickerId){
        await connectDB()
        const groupconversation=await Groupconversationodel.findOne({_id:groupId})
        if(groupconversation){
            const isKickerAdmin=groupconversation.createdBy.toString()===kickerId||groupconversation.admins.map((data:any)=>data.toString()).includes(kickerId)
            if(!isKickerAdmin){
                return "Error"
            }
            if(groupconversation.createdBy.toString()===memberId){
                return "Error"
            }
            const memberIsAdmin=groupconversation.admins.map((data:any)=>data.toString()).includes(memberId)
            if(memberIsAdmin&&groupconversation.createdBy.toString()!==kickerId){
                return "Error"
            }
            groupconversation.admins=groupconversation.admins.filter((data:any)=>data.toString()!==memberId)
            groupconversation.members=groupconversation.members.filter((data:groupmember)=>data.id!==memberId)
            await groupconversation.save()
            return "Success"
        }
        else{
            return "Error"
        }
    }
    return "Error"
}
