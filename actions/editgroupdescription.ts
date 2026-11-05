"use server"
import Groupconversationodel from '@/models/groupconversation'
import connectDB from '@/database/db_configure'
export default async function Editgroupdescription(groupId:string,description:string){
  if(groupId&&description){
    await connectDB()
    const group=await Groupconversationodel.findOne({_id:groupId})
    if(group){
        group.description=description
        await group.save()
        return "Success"
    }
    else{
        return "Error"
    }
  }
}