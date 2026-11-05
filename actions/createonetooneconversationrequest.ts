"use server"
import Onetooneconversationodel from '@/models/onetooneconversationrequest'
import { onetoonerequest } from "@/types/request"
import connectDB from '@/database/db_configure'
export default async function Createonetooneconversationrequest(value:onetoonerequest){
    await connectDB()
    const existing=await Onetooneconversationodel.findOne({
        $or:[
            {senderId:value.senderId,recieverId:value.recieverId},
            {senderId:value.recieverId,recieverId:value.senderId}
        ]
    })
    if(existing){
        existing.senderId=value.senderId
        existing.recieverId=value.recieverId
        existing.sendAt=value.sendAt
        existing.status=value.status
        await existing.save()
        return "Success"
    }
    await new Onetooneconversationodel(value).save()
    return "Success"
}
