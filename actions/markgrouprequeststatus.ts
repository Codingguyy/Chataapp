"use server"
import Grouprequestodel from '@/models/grouprequest'
import { status } from '@/types/1to1conversations'
import connectDB from '@/database/db_configure'
export default async function Markgrouprequeststatus(groupId:string,sendBy:{id:string,name:string},status:status){
   if(groupId&&sendBy&&status){
    await connectDB()
    const grouprequest=await Grouprequestodel.findOne({groupId:groupId,sendBy:sendBy})
    if(grouprequest){
        grouprequest.status=status
    }
    await grouprequest.save()
    return "Success"
   }
   else{
    return "Error"
   }
}