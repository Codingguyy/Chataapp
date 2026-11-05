"use server"
import Onetooneconversationodel from '@/models/Onetooneconversation'
import Onetooneconversationsodel from '@/models/conversation'
import connectDB from '@/database/db_configure'
import Getsngleuser from './getsngleuser'
export default async function Loadonetooneconversationexistlist(id:string){
    await connectDB()
    const onetooneconversations=await Onetooneconversationodel.find()
    const conversations= onetooneconversations.filter(data=>data.participants.includes(id))
    const array:{count:number,id:string}[]=[]
    let arrayy=[]
    for(const conversation of conversations){
        const onetooneconversation=await Onetooneconversationsodel.find({chatId:conversation._id})
        if(onetooneconversation?.length){
            let count:number=onetooneconversation.filter(data=>data.status!=="view")?.length
            array.push({count:count,id:conversation._id})
        }
    }
    for(const value of conversations){
        if(array.some(data=>data.id===value._id)){
            const idd=value.participants.filter((data:string)=>data!==id)
            const userdetails=await Getsngleuser(idd)
            let valuee={unread_messages:array.find(data=>data.id===value._id)?.count,seen:false,name:userdetails.name,email:userdetails.email,description:value?.description||"",_id:idd}
            arrayy.push(valuee)
        }
    }
    return arrayy.length?arrayy:[]
}