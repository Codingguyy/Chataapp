import mongoose from 'mongoose'
import { models } from 'mongoose';
const Onetooneconversation=new mongoose.Schema({
    chatId:{type:String,required:true},
    participants:{type:[String],required:true,validate:{validator:function(val){return val.length<=2;},message:"Particpants cannot be more than two"}},
    deletedAt:{type:Date},
    createdAt:{type:Date,default:Date.now},
    status:{type:String,enum:["deleted","accepted","pending"],required:true}
})
export default models.onetooneconversation||mongoose.model("onetooneconversation",Onetooneconversation)

