"use server"
import Groupconversationodel from '@/models/groupconversation'
import connectDB from '@/database/db_configure'
export default async function Editgroupname(groupId:string,name:string,id:string){
    if(groupId&&name&&id){
        await connectDB()
        const group=await Groupconversationodel.findOne({_id:groupId})
        if(group){
            if(group.settings.onlyAdminCanEditInfo){
                if(group.admins.includes(id)){
                    group.name=name
                    return "Success"
                    await group.save()
                }
                else{
                    return "Success"
                }
            }
            else if(!group.settings.onlyAdminCanEditInfo&&group.createdBy===id){
                group.name=name
                return "Success"
                await group.save()
            }
            else{
                return "Success"
            }
        }
        else{
            return "Error"
        }
    }
}