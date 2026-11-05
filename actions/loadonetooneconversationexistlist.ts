"use server"
import Onetooneconversationodel from '@/models/Onetooneconversation'
import Onetooneconversationsodel from '@/models/conversation'
import connectDB from '@/database/db_configure'
import Getsngleuser from './getsngleuser'
export default async function Loadonetooneconversationexistlist(id:string){
    await connectDB()
    const onetooneconversations=await Onetooneconversationodel.find()
    const conversations=onetooneconversations.filter(data=>data.participants.includes(id)&&data.status==="accepted")
    const array:{count:number,id:string}[]=[]
    let arrayy=[]
    for(const conversation of conversations){
        const onetooneconversation=await Onetooneconversationsodel.find({chatId:conversation.chatId})
        if(onetooneconversation?.length){
            let count:number=onetooneconversation.filter(data=>data.status!=="view")?.length
            array.push({count:count,id:conversation.chatId})
        }
    }
    for(const value of conversations){
        if(array.some(data=>data.id===value.chatId)){
            const partnerId=value.participants.find((participant:string)=>participant!==id)
            if(!partnerId) continue
            const userdetails=await Getsngleuser(partnerId)
            const valuee={unread_messages:array.find(data=>data.id===value.chatId)?.count||0,seen:false,name:userdetails.name,email:userdetails.email,description:"",_id:partnerId}
            arrayy.push(valuee)
        }
    }
    return arrayy.length?arrayy:[]
}