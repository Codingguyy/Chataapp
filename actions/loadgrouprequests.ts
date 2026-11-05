"use server"
import Grouprequestodel from '@/models/grouprequest'
import Groupconversationodel from '@/models/groupconversation'
import connectDB from '@/database/db_configure'
import { groupmember } from '@/types/groupconversations'
export default async function Loadgrouprequests(mode:number,id:string){
    await connectDB()
    if(mode===1){
        const grouprequests=await Grouprequestodel.find({sendBy:id})
        return grouprequests
    }
    else if(mode===2){
        let grouprequests=[]
        const groupconversation=await Groupconversationodel.find()
        const grouplist=[...groupconversation].filter(data=>data.members.some((data:groupmember)=>data.id===id)).map(data=>({groupId:data._id}))
        for (const group of grouplist){
            const grouprequest=await Grouprequestodel.find({groupId:group.groupId})
            grouprequests.push(...grouprequest)
        }
        return grouprequests.filter(data=>data.sendBy!==id)
    }
}