"use server"
import Groupconversationsodel from '@/models/groupconversations'
import { groupconversations } from '@/types/groupconversations'
import { grpconversations } from '@/types/groupconversations'
import { messageattachment } from '@/types/1to1conversations'
import connectDB from '@/database/db_configure'
export default async function Creategroupconversation(groupId:string,message:string,sendBy:string,name:string,globalId:string,status:grpconversations,attachment?:messageattachment){
    await connectDB()
 const conversation:groupconversations={groupId:groupId,sendBy:sendBy,globalId:globalId,message:message,createdAt:new Date(),name:name,status:status,attachment:attachment}
 await new Groupconversationsodel(conversation).save()
 return globalId
}