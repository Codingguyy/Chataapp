import mongoose from 'mongoose'
import { models } from 'mongoose'
const Groupconversations=new mongoose.Schema({
    groupId:{type:String,required:true},
    globalId:{type:String,required:true},
    message:{type:String,default:""},
    sendBy:{type:String,required:true},
    createdAt:{type:Date,default:Date.now},
    status:{type:String,enum:["deleted","deleteforme","none"]},
    deletedFor:{type:[String],default:[]},
    editedAt:{type:Date},
    replyTo:{
        globalId:{type:String},
        message:{type:String}
    },
    attachment:{
        url:{type:String},
        type:{type:String,enum:["pdf","jpg"]},
        name:{type:String}
    },
})

export default models.groupconversationsodel||mongoose.model("groupconversationsodel",Groupconversations)