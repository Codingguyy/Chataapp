import mongoose from 'mongoose'
import { models } from 'mongoose'
const Onetooneconversationrequest=new mongoose.Schema({
    senderId:{type:String,required:true},
    sendAt:{type:Date,required:true},
    recieverId:{type:String,required:true},
    status:{type:String,enum:["accepted","rejected","pending"],required:true}
})
export default models.onetooneconversationrequest||mongoose.model("onetooneconversationrequest",Onetooneconversationrequest)