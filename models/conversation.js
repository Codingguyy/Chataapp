import mongoose from 'mongoose'
import { models } from 'mongoose'
const Conversation=new mongoose.Schema({
    senderId:{type:String,required:true},
    chatId:{type:String,required:true},
    status:{type:String,enum:['view','deleted','pending'],required:true},
    deletedFor:{type:[String],default:[]},
    global_id:{type:String,unique:true},
    message:{type:String,default:""},
    createdAt:{type:Date,required:true},
    replyTo:{
        senderId:{type:String},
        global_id:{type:String},
        message:{type:String}
    },
    attachment:{
        url:{type:String},
        type:{type:String,enum:["pdf","jpg"]},
        name:{type:String}
    }
})
export default models.conversation||mongoose.model("conversation",Conversation)