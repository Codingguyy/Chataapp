"use server"
import Grouprequestodel from '@/models/grouprequest'
import { grouprequest } from '@/types/groupconversations'
import connectDB from '@/database/db_configure'
export default async function Creategrouprequest(value:grouprequest){
   if(value){
    await connectDB()
    const grouprequest=await Grouprequestodel.findOne({groupId:value.groupId,sendBy:value.sendBy})
    if(grouprequest){
      
    }
    else{
      await new Grouprequestodel(value).save()
    }
    return "Success"
   }
   else{
    return "Error"
   }
}