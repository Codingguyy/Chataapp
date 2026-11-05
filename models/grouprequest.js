import mongoose from 'mongoose'
import { models } from 'mongoose'
const grouprequestOdel=new mongoose.Schema({
    sendBy:{id:{type:String,required:true},name:{type:String,required:true}},
    groupId:{type:String,required:true},
    sendAt:{type:Date,default:Date.now},
    status:{type:String,enum:["pending","accepted","deleted"],required:true},
    type:{type:String,enum:["dm_request",
   "group_join_request",
   "group_invite",
    "friend_request"]}
})
export default models.grouprequestodel||mongoose.model("grouprequestodel",grouprequestOdel)