"use server"
import Groupconversationsodel from '@/models/groupconversations'
import { groupconversations } from '@/types/groupconversations'
import { grpconversations } from '@/types/groupconversations'
import connectDB from '@/database/db_configure'
export default async function Creategroupreplyconversations(message:string,global_Id:string,groupId:string,replymessage:string,id:string,name:string,replyglobalId:string,status:grpconversations){
   await connectDB()
   const parent=await Groupconversationsodel.findOne({globalId:global_Id,groupId:groupId}).lean()
   if(!parent) throw new Error("Reply target not found in this group")
   const groupconversation:groupconversations={message:replymessage,groupId:groupId,globalId:replyglobalId,sendBy:id,name:name,_id:"",createdAt:new Date(),status:status,replyTo:{globalId:global_Id,message:message}}
   await new Groupconversationsodel(groupconversation).save()
   return replyglobalId
}