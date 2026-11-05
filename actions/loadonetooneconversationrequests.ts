"use server"
import Onetooneconversationrequestodel from '@/models/onetooneconversationrequest'
import connectDB from '@/database/db_configure'
export default async function Loadonetooneconversationrequests(id:string){
    await connectDB()
    const onetooneconversations=await Onetooneconversationrequestodel.find()
    if(onetooneconversations.length){
    const onetooneconversationrecieverequests=[...onetooneconversations].filter(data=>((data.senderId===id||data.recieverId===id)&&data.senderId!==id))
    const onetooneconversationsendrequests=[...onetooneconversations].filter(data=>((data.senderId===id||data.recieverId===id)&&data.senderId===id))
    return {onetooneconversationrecieverequests:onetooneconversationrecieverequests,onetooneconversationsendrequests:onetooneconversationsendrequests}
    }
    else{
        return {onetooneconversationrecieverequests:[],onetooneconversationsendrequests:[]}
    }
}