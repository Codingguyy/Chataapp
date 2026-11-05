"use server"
import connectDB from '@/database/db_configure'
import Groupconversationodel from '@/models/groupconversation'
export default async function Creategroup(name:string,description:string,_id:string,createdname:string,code:string){
    await connectDB()
    if(name&&description&&_id){
        const groupconversationodel={name:name,description:description,code:code,members:[{id:_id,name:createdname}],admins:[_id],createdBy:_id,createdAt:new Date(),settings:{
            onlyAdminCanEditInfo:false,
            onlyAdminCanMessage:false
        },status:"active"}
        await new Groupconversationodel(groupconversationodel).save()
        return {code:code}
    }
    else{
        return "An error occurred"
    }
}
{/*name:{type:String,required:true},
    description:{type:String},
    code:{type:String,required:true,unique:true},
    members:[{id:{type:mongoose.Schema.Types.ObjectId,ref:"userodel",required:true},lastseenmessageId:{type:String},name:{type:String,required:true}}],
    admins:[{type:mongoose.Schema.Types.ObjectId,ref:"userodel",required:true}],
    createdAt:{type:Date,default:Date.now},
    createdBy:{type:mongoose.Schema.Types.ObjectId,ref:"userodel",required:true},
    updatedAt:{type:Date},
    settings:{
        onlyAdminsCanMessage:{type:Boolean,required:true},
        onlyAdminCanEditInfo:{type:Boolean,required:true}
    },
    status:{type:String,enum:["deleted","active","archived"],required:true}, */}