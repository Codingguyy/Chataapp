import mongoose from 'mongoose'
import { models } from 'mongoose'
const Groupconversation=new mongoose.Schema({
    name:{type:String,required:true},
    description:{type:String},
    code:{type:String,required:true,unique:true},
    members:[{id:{type:mongoose.Schema.Types.ObjectId,ref:"userodel",required:true},lastseenmessageId:{type:String},name:{type:String,required:true}}],
    admins:[{type:mongoose.Schema.Types.ObjectId,ref:"userodel",required:true}],
    createdAt:{type:Date,default:Date.now},
    createdBy:{type:mongoose.Schema.Types.ObjectId,ref:"userodel",required:true},
    updatedAt:{type:Date},
    settings:{
        onlyAdminCanMessage:{type:Boolean,required:true},
        onlyAdminCanEditInfo:{type:Boolean,required:true}
    },
    status:{type:String,enum:["deleted","active","archived"],required:true},
    blocked:{type:[String],default:[]}
})
export default models.groupconversationodel||mongoose.model("groupconversationodel",Groupconversation)
