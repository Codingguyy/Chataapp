'use server'
import Groupconversationodel from '@/models/groupconversation'
import { groupmember } from '@/types/groupconversations'
import connectDB from '@/database/db_configure'
export default async function Loadgroupexistlist(id:string){
   if(id){
    await connectDB()
    const groupslist=await Groupconversationodel.find()
    if(groupslist?.length){
    const groupexistlist=[...groupslist].filter(data=>data.members.some((dataa:groupmember)=>dataa.id===id))
    return groupexistlist.map(data=>({name:data.name,description:data.description,groupId:data.groupId,createdBy:data.createdBy,createdAt:data.createdAt,member_no:data.members.length,status:data.status,code:data.code,admins_info:data.members.map((dataa:groupmember)=>data.admins.includes(dataa.id))}))
    }
    else{
      return []
    }
   }
   else{
    return []
   }
}