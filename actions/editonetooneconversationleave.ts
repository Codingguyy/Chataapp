"use server"
import Onetooneconversationodel from '@/models/Onetooneconversation'
import Onetooneconversationrequestodel from '@/models/onetooneconversationrequest'
import connectDB from '@/database/db_configure'
export default async function Editonetooneconversationleave(senderId:string,recieverId:string,chatId:string){
    if(senderId&&recieverId&&chatId){
        await connectDB()
        const conversation=await Onetooneconversationodel.findOne({chatId:chatId})
        if(conversation){
            conversation.status="deleted"
            conversation.deletedAt=new Date()
            await conversation.save()
        }
        const request=await Onetooneconversationrequestodel.findOne({
            $or:[
                {senderId:senderId,recieverId:recieverId},
                {senderId:recieverId,recieverId:senderId}
            ]
        })
        if(request){
            request.status="rejected"
            await request.save()
        }
        return "Success"
    }
    return "Error"
}
