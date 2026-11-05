"use server"
import Onetooneconversationodel from '@/models/onetooneconversationrequest'
import { onetoonerequest } from "@/types/request"
import connectDB from '@/database/db_configure'
export default async function Createonetooneconversationrequest(value:onetoonerequest){
    await connectDB()
    const onetooneconversationrequest=await Onetooneconversationodel.findOne({recieverId:value.recieverId,senderId:value.senderId})
    if(!onetooneconversationrequest){
        await new Onetooneconversationodel(value).save()
    }
}