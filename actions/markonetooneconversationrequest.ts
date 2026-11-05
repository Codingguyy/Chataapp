"use server"
import Onetooneconversationrequestodel from '@/models/onetooneconversationrequest'
import { status } from '@/types/1to1conversations'
import connectDB from '@/database/db_configure'
export default async function Markonetooneconversationrequest(senderId:string,recieverId:string,status:status){
    await connectDB()
    const onetooneconversationrequest=await Onetooneconversationrequestodel.findOne({senderId:senderId,recieverId:recieverId})
    if(onetooneconversationrequest){
        onetooneconversationrequest.status=status
        await onetooneconversationrequest.save()
    }
}
