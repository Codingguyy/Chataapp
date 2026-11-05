"use server"
import Groupconversationodel from '@/models/groupconversation'
import connectDB from '@/database/db_configure'
export default async function Markgroupblockmember(groupId:string,memberId:string,adminId:string,action:"block"|"unblock"){
    if(groupId&&memberId&&adminId&&action){
        await connectDB()
        const groupconversation=await Groupconversationodel.findOne({_id:groupId})
        if(groupconversation){
            const isadmin=groupconversation.createdBy.toString()===adminId||groupconversation.admins.map((id:any)=>id.toString()).includes(adminId)
            if(!isadmin){
                return "Error"
            }
            if(action==="block"){
                if(!groupconversation.blocked.includes(memberId)){
                    groupconversation.blocked.push(memberId)
                    await groupconversation.save()
                }
                return "Success"
            }
            else if(action==="unblock"){
                groupconversation.blocked=groupconversation.blocked.filter((data:string)=>data!==memberId)
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
