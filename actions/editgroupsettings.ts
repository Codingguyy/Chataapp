"use server"
import Groupconversationodel from '@/models/groupconversation'
import { groupsettings } from "@/types/groupconversations"
import connectDB from '@/database/db_configure'
export default async function Editgroupsettings(groupId:string,settings:groupsettings,value:boolean,id:string){
    if(groupId&&settings&&id){
        await connectDB()
        const groupconversation=await Groupconversationodel.findOne({_id:groupId})
        if(groupconversation){
            if(groupconversation.admins.includes(id)){
                if(settings==="OnlyAdminCanEditInfo"){
                    groupconversation.settings.OnlyAdminCanEditInfo=value
                }
                else if(settings==="OnlyAdminCanEditMessage"){
                    groupconversation.settings.OnlyAdminCanEditMessage=value
                }
            }
            return "Success"
        }
        else {
            return "Error"
        }
    }
}