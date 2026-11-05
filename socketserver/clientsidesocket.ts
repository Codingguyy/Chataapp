"use client"
import { useRef } from "react"
import { useRouter } from "next/navigation"
import { Userlist } from "@/components/store"
import { Onetooneconversationrequest } from "@/components/store"
import { Onetooneconversationsendrequest } from "@/components/store"
import { Onetooneconversationdetails } from "@/components/store"
import { Userexistlistt } from "@/components/store"
import { Parmkey } from "@/components/store"
import { Typingindicator } from "@/components/store"
import { Onlineindicator } from "@/components/store"
import { Onlinestatusmap } from "@/components/store"
import { Conversationpagination } from "@/components/store"
import { Toklue } from "@/components/store"
import { UsercurrentId } from "@/components/store"
import { Searchexistgrouplist} from '@/components/store'
import { Groupsendrequest } from "@/components/store"
import { Grouprecieverequest } from "@/components/store"
import { Groupexists } from "@/components/store"
import { Grouppicked } from "@/components/store"
import { Grouptypinglist } from "@/components/store"
import { Grouppagination } from "@/components/store"
import { GroupuserseenmessageId } from "@/components/store"
import { Grouptypingonline } from "@/components/store"
import toast from "react-hot-toast"
import { conversations, messagestatus, oneto1conversation, status } from "@/types/1to1conversations"
import { usrlist, usrlistt } from "@/types/user"
import { messagetypee } from "@/types/1to1conversations"
import { messageattachment } from "@/types/1to1conversations"
import { groupconversation, groupconversations, grouprequest, groupsettings, groupsexistlist, grpconversations, grpstatustype, promote } from "@/types/groupconversations"
import { groupmember } from "@/types/groupconversations"
import { grouponlinetyping } from "@/types/groupconversations"
import { Reloadeverything } from "@/components/store"
import { StringDecoder } from "string_decoder"
import { id } from "date-fns/locale"
import { onetoonerequest } from "@/types/request"
type Listener=(data:any)=>void
const Listeners=new Map<string,Listener[]>()
let socketinstanceref:WebSocket|null=null
export function socket(){
  if(socketinstanceref) socketinstanceref
  const setuserlist=Userlist.getState().setusrs
  const setmessage=Userlist.getState().setmessage
  const setremovesearchuserlist=Userlist.getState().setremoveuser
  const setonetooneconversationrequest=Onetooneconversationrequest.getState().setrequests
  const setremoveonetooneconversationrequest=Onetooneconversationrequest.getState().setremovespecificrequest
  const setmarkonetooneconversationrequest=Onetooneconversationrequest.getState().setmarkspecificrequest
  const setonetooneconversationrecieverequests=Onetooneconversationrequest.getState().setrequsts
  const setremoveonetooneconversationsendrequest=Onetooneconversationsendrequest.getState().setremovespecificrequest
  const setmarkonetooneconversationsendrequest=Onetooneconversationsendrequest.getState().setmarkspecificrequest
  const setonetooneconversationsendrequests=Onetooneconversationsendrequest.getState().setrequsts
  const onetooneconversationdetails=Onetooneconversationdetails.getState().onetooneconversationdetails
  const setonetooneconversationdetails=Onetooneconversationdetails.getState().setonetooneconversationdetails
  const setonetooneconversationdetailsmessage=Onetooneconversationdetails.getState().setmessage
  const setparamkey=Parmkey.getState().setname
  const setonetooneconversationdetailsmarkstatusmessage=Onetooneconversationdetails.getState().setmarkmessagestatus
  const setonetooneconversationdetailsmarkglobalmessage=Onetooneconversationdetails.getState().setmarkmessagestatusglobalid
  const setprependmessagesonetooneconversation=Onetooneconversationdetails.getState().setprependmessages
  const setmarkonetooneconversationdetails=Onetooneconversationdetails.getState().setmarkonetooneconversationdetails
  const setonetooneconversationmessageslice=Onetooneconversationdetails.getState().setslicemessage
  const setsendername=Onetooneconversationdetails.getState().setsendername
  const setrecievername=Onetooneconversationdetails.getState().setrecievername
  const setsenderdescription=Onetooneconversationdetails.getState().setsenderdescription
  const setrecieverdescription=Onetooneconversationdetails.getState().setrecieverdescription
  const seteditmessageonetooneconversation=Onetooneconversationdetails.getState().seteditmessage
  const setuserexistlistt=Userexistlistt.getState().setusrs
  const setuserexistlist=Userexistlistt.getState().setuser
  const userexistmessage=Userexistlistt.getState().message
  const existuserlist=Userexistlistt.getState().users
  const setuserexistmessage=Userexistlistt.getState().setmessage
  const setremoveuserexistlist=Userexistlistt.getState().setremoveuser
  const setusersexistlist=Userexistlistt.getState().setusrs
  const setuserexistlistunredmessages=Userexistlistt.getState().setunreadmesages
  const setuserexistlistseenmessages=Userexistlistt.getState().setseenmesages
  const settypingid=Typingindicator.getState().setid
  const settypingstatus=Typingindicator.getState().settyping
  const setonlineid=Onlineindicator.getState().setid
  const setonlinestatus=Onlineindicator.getState().setonline
  const setseenon=Onlineindicator.getState().setseenon
  const setonlinestatusmap=Onlinestatusmap.getState().setstatus
  const setcursorid=Conversationpagination.getState().setcursorid
  const sethasmore=Conversationpagination.getState().sethasmore
  const setonetooneconversationsendrequest=Onetooneconversationsendrequest.getState().setrequestss
  const setonetooneconversationrecieverequest=Onetooneconversationrequest.getState().setrequestss
  const token=Toklue.getState().name
  const usercurrentid=UsercurrentId.getState().name
  const searchexistgrouplist=Searchexistgrouplist.getState().groups
  const setsearchexistgrouplist=Searchexistgrouplist.getState().setgroups
  const setsearchexistgrouplistmessage=Searchexistgrouplist.getState().setmessage
  const setstatussearchgroupexist=Searchexistgrouplist.getState().setstatus
  const setremovesearchgroupexist=Searchexistgrouplist.getState().removegroup
  const setaddmembersearchgroupexist=Searchexistgrouplist.getState().setaddmember
  const setremovemembersearchgroupexistlist=Searchexistgrouplist.getState().setremovemember
  const setremoveadminsearchgroupexistlist=Searchexistgrouplist.getState().setremoveadmin
  const setsendgrouprequest=Groupsendrequest.getState().setrequest
  const setgroupsendrequests=Groupsendrequest.getState().setrequests
  const setstatussendgrouprequest=Groupsendrequest.getState().setrequeststatus
  const setremovegroupsendrequest=Groupsendrequest.getState().removerequest
  const setrecievegrouprequest=Grouprecieverequest.getState().setrequest
  const setrecievegrouprequests=Grouprecieverequest.getState().setrequests
  const setstatusrecievegrouprequest=Grouprecieverequest.getState().setrequeststatus
  const setremovegrouprecieverequest=Grouprecieverequest.getState().removerequest
  const setaddmembergroupexistlist=Groupexists.getState().setaddmember
  const setaddgroupexistlist=Groupexists.getState().setgroup
  const setaddgroupsexistlist=Groupexists.getState().setgroups
  const setremovegroupexistlist=Groupexists.getState().removegroup
  const setremovemembergroupexistlist=Groupexists.getState().setremovemember
  const setremoveadmingroupexistlist=Groupexists.getState().setremoveadmin
  const setaddadmingroupexistlist=Groupexists.getState().setaddadmin
  const setaddgrouppicked=Grouppicked.getState().setconversation
  const setaddgroupconversations=Grouppicked.getState().setconversations
  const setaddgroupsngleconversations=Grouppicked.getState().setsngleconversations
  const setviewgroupmessage=Grouppicked.getState().setviewmessage
  const setaddgroupadmin=Grouppicked.getState().setgroupadmin
  const setremovegroupadmin=Grouppicked.getState().removegroupadmin
  const setremovemembergrouppicked=Grouppicked.getState().removegroupmember
  const grouppicked=Grouppicked.getState().group
  const setgrouppagimessages=Grouppicked.getState().setpagimessages
  const setgroupslicemessage=Grouppicked.getState().setslicemessage
  const setgroupmessagestatuschange=Grouppicked.getState().setconversationchangestatus
  const setgroupconversationmessageedit=Grouppicked.getState().setconversationmessageedit
  const setgroupsettings=Grouppicked.getState().setgroupsettings
  const setgroupname=Grouppicked.getState().setgroupname
  const setgroupdescription=Grouppicked.getState().setgroupdescription
  const setgroupblockmember=Grouppicked.getState().setblockmember
  const setgroupunblockmember=Grouppicked.getState().setunblockmember
  const addtypingmember=Grouptypinglist.getState().setaddtyping
  const removetypingmember=Grouptypinglist.getState().setremovetyping
  const setchangestatustyping=Grouptypinglist.getState().settyping
  const typinggrouplist=Grouptypinglist.getState().typing
  const grouphasMore=Grouppagination.getState().hasMore
  const groupcursorId=Grouppagination.getState().cursor_id
  const setgroupcursorId=Grouppagination.getState().setcursorid
  const setgrouphasmore=Grouppagination.getState().sethasmore
  const setgroupuserseenmessageid=GroupuserseenmessageId.getState().setname
  const setgrouptypingonlinelist=Grouptypingonline.getState().setlist
  const setresetgrouptypingonlinelist=Grouptypingonline.getState().setresetlist
  const setgrouptypingstatus=Grouptypingonline.getState().setchangetypingstatus
  const grouptypinglist=Grouptypingonline.getState().list
  const setreloadgrpexistlist=Reloadeverything.getState().setgrpexistlist
  const setreloadgrprequestsrecieve=Reloadeverything.getState().setgrprequestsrecieve
  const setreloadgrprequestssend=Reloadeverything.getState().setgrprequestssend
  const setreloadonetooneexistlist=Reloadeverything.getState().setonetooneexistlist
  const setreloadonetoonerequests=Reloadeverything.getState().setonetoonerequests
  const socketBase = process.env.NEXT_PUBLIC_SOCKET_URL || `${window.location.protocol === "https:" ? "wss:" : "ws:"}//${window.location.hostname}:8080`
  socketinstanceref=new WebSocket(`${socketBase}?token=${encodeURIComponent(token)}`)
  function handlemessage(){
    toast.error("no user found")
    setmessage("No user found")
    setuserlist([])
  }
  function handletoast(message:string){
    toast.error(message)
  }
  function handlerecievertoast(){
    toast.success("You have an new request")
  }
  function handlesendertoast(message:string){
    toast.success(message)
  }
  function handlesenderacceptedtoast(message:string){
    toast.success(message)
  }
  function handlerecieveracceptedtoast(message:string){
    toast.success(message)
  }
  function handlesenderrejectedtoast(message:string){
    toast.error(message)
  }
  function handlerecieverrejectedtoast(message:string){
    toast.error(message)
  }
  function getkey(senderId:string,recieverId:string){
    const array=[senderId,recieverId].sort((a,b)=>a.toLocaleLowerCase().localeCompare(b.toLocaleLowerCase())).join(":")
    return array
  }
  function handleonetooneconversationmessages(senderId:string,recieverId:string,createdAt:Date,message:string,_id:string,status:messagestatus,senderwho:string,global_id:string,messages_seen:{unred_messages:number,seen:boolean},replyto:{global_id:string,message:string},attachment?:messageattachment){
    setonetooneconversationdetailsmessage({senderId:_id,message:message,createdAt:createdAt,status:status,global_id:global_id,replyto:replyto,attachment:attachment})
    if(_id!==UsercurrentId.getState().name){
      setuserexistlistunredmessages(messages_seen.unred_messages,_id)
      setuserexistlistseenmessages(messages_seen.seen,_id)
    }
    setonetooneconversationmessageslice()
  }
  function handleonetooneconversationdeletedmessages(message:string,createdAt:Date,_id:string,senderwho:string,globalId:string){
    setonetooneconversationdetailsmarkglobalmessage(globalId,"deleted")
    if(senderwho==="sender"){
      toast.success("message deleted for everyone")
    }
  }
  function handleonetooneconversationviewmessages(global_id:string,status:messagestatus,messages_seen:{unred_messages:number,seen:boolean},_id:string,senderId:string){
    setonetooneconversationdetailsmarkglobalmessage(global_id,status)
    if(_id===UsercurrentId.getState().name){
      setuserexistlistunredmessages(messages_seen.unred_messages,senderId)
      setuserexistlistseenmessages(messages_seen.seen,senderId)
    }
  }
  function handleremoveonetooneconversationrequest(senderId:string,recieverId:string){
    setremovesearchuserlist(recieverId)
  }
  function handleaddexistuser(userr:usrlistt){
    setuserexistlist(userr)
  }
  function handleremoveonetooneconversationrecrequest(senderId:string){
    setremovesearchuserlist(senderId)
  }
  function handletypingonetooneconversation(id:string,typing:boolean){
    settypingid(id)
    settypingstatus(typing)
  }
  function handleuserstatusonetooneconversation(id:string,status:boolean){
    setonlineid(id)
    setonlinestatus(status)
  }
  function handleloadmoreonetooneconversations(hasMore:boolean,cursor_id:string,messages:messagetypee[]){
    setprependmessagesonetooneconversation(messages)
    setcursorid(cursor_id)
    sethasmore(hasMore)
  }
  function handleleaveconversationtoast(value:string){
    toast.success(value)
    setmarkonetooneconversationdetails("deleted")
  }
  function handledeleteformetoast(message:string,messageId:string,status:messagestatus){
    setonetooneconversationdetailsmarkglobalmessage(messageId,status)
    toast.success(message)
  }
  function handlenamechangeonetooneconversation(message:string,_id:string,name:string){
    const senderId=Onetooneconversationdetails.getState().onetooneconversationdetails.senderId._id
    const recieverId=Onetooneconversationdetails.getState().onetooneconversationdetails.recieverId._id
    if(senderId===_id){
        setsendername(name)
    }
    else if(recieverId===_id){
      setrecievername(name)
    }
    toast.success(message)
  }
  function handledescriptionchangeonetooneconversation(message:string,_id:string,description:string){
    const senderId=Onetooneconversationdetails.getState().onetooneconversationdetails.senderId._id
    const recieverId=Onetooneconversationdetails.getState().onetooneconversationdetails.recieverId._id
    if(senderId===_id){
      setsenderdescription(description)
    }
    else if(recieverId===_id){
      setrecieverdescription(description)
    }
  }
  function handlelogoutonetooneconversation(id:string,date:Date){
      setonlineid(id)
      setonlinestatus(false)
      setseenon(date)
      setonlinestatusmap(id,false,date)
  }
  function handleonlinestatusonetooneconversation(id:string,online:boolean){
      setonlineid(id)
      setonlinestatus(online)
      const now=new Date()
      setseenon(now)
      setonlinestatusmap(id,online,now)
  }
  function handleeditmessageonetooneconversation(global_id:string,message:string,_id:string){
    if(UsercurrentId.getState().name===_id){
      toast.success("Message edited successfully")
    }
    seteditmessageonetooneconversation(global_id,message)
  }
  function handlenogrouptoast(message:string){
      toast.success(message)
  }
  function handlesearchgroupexistlist(groups:groupsexistlist[],message:string){
      setsearchexistgrouplist(groups)
      setsearchexistgrouplistmessage(message)
  }
  function handletoaststatuserrorchange(message:string){
    toast.error(message)
  }
  function handlegroupstatuschange(groupId:string,status:grpstatustype){
    setstatussearchgroupexist(status,groupId)
  }
  function handlesendgrouprequest(message:string,request:grouprequest){
    if(message!=="Request already send"){
    setsendgrouprequest(request)
    toast.success(message)
    }
    else{
      toast.error(message)
    }
  }
  function handlerecievegrouprequest(message:string,request:grouprequest){
    setrecievegrouprequest(request)
    toast.success(message)
  }
  function handlerecievergrouprequesterror(message:string){
    toast.success(message)
  }
  function handlerecievergrouprequestaccept(groupId:string,member:groupmember,status:status){
    setstatusrecievegrouprequest(status,groupId,member.id)
    setaddmembergroupexistlist(groupId)
    setaddmembersearchgroupexist(groupId)
    toast.success("You accepted request")
  }
  function handlesendergrouprequesterror(message:string){
    toast.error(message)
  }
  function handlesendergrouprequestaccept(group:groupsexistlist,groupId:string,sendBy:string,status:status){
    setstatussendgrouprequest(status,groupId,sendBy)
    setremovesearchgroupexist(groupId)
    setaddmembersearchgroupexist(groupId)
    setaddmembergroupexistlist(groupId)
    setaddgroupexistlist(group)
    toast.success("Ur request got accepted")
  }
  function handlecreategrouperror(message:string){
    toast.error(message)
  }
  function handlecreategroup(group:groupsexistlist){
    setaddgroupexistlist(group)
    toast.success("Group created Successfully")
  }
  function handlegroupinviterequestalreadysend(message:string){
    toast.error(message)
  }
  function handlegroupinviterequestsend(request:grouprequest,message:string){
    setsendgrouprequest(request)
    toast.success(message)
  }
  function handlegroupinviteacceptsendto(groupId:string,sendBy:string,group:groupsexistlist,message:string){
    setstatusrecievegrouprequest("accepted",groupId,sendBy)
    setaddmembersearchgroupexist(groupId)
    setaddmembergroupexistlist(groupId)
    setaddgroupexistlist(group)
    toast.success(message)
  }
  function handlegroupinviteacceptsendby(groupId:string,sendTo:string,message:string){
    setstatussendgrouprequest("accepted",groupId,usercurrentid)
    setaddmembersearchgroupexist(groupId)
    setaddmembergroupexistlist(groupId)
    toast.success(message)
  }
  function handlegroupinviterequestrecieve(request:grouprequest,message:string){
    setrecievegrouprequest(request)
    toast.success(message)
  }
  function handlegroupconversation(group:groupconversation,groupmessages:groupconversations[]){
    setaddgroupconversations(groupmessages)
    setaddgrouppicked(group)
    setresetgrouptypingonlinelist()
    setparamkey(group.groupId)
  }
  function handlegroupsendmessagetoast(value:string){
    toast.error(value)
  }
  function handlegroupsendmessage(conversation:groupconversations,message:string){
    setaddgroupsngleconversations(conversation)
    setgroupslicemessage()
    toast.success(message)
  }
  function handleviewgroupmessage(groupId:string,globalId:string,messageId:string){
    setviewgroupmessage(usercurrentid,messageId)
    setgroupuserseenmessageid(messageId)
  }
  function handlechangememberstatustoast(message:string){
    toast.error(message)
  }
  function handlechangememberstatus(promoteId:string,status:promote,name:string,extramessage:string){
    if(status==="admin"){
      setaddgroupadmin(promoteId,name)
    }
    else if(status==="member"){
      setremovegroupadmin(promoteId)
    }
    toast.success(extramessage)
  }
  function handlememberleavegroup(id:string,groupId:string){
     if(id===UsercurrentId.getState().name){
        setremovegroupexistlist(groupId)
        setremovesearchgroupexist(groupId)
        setremovegroupsendrequest(groupId,id)
        setremovegrouprecieverequest(groupId,id)
     }
     else{
      setremovemembergroupexistlist(id,groupId)
      if(groupId===Grouppicked.getState().group.groupId){
      setremovemembergrouppicked(id)
      }
      setremovemembersearchgroupexistlist(id,groupId)
      setremovegroupsendrequest(groupId,id)
      setremovegrouprecieverequest(groupId,id)
     }
  }
  function handlekickmember(id:string,groupId:string,message:string){
     if(id===UsercurrentId.getState().name){
        setremovegroupexistlist(groupId)
        setremovesearchgroupexist(groupId)
        setremovegroupsendrequest(groupId,id)
        setremovegrouprecieverequest(groupId,id)
        toast.error(message)
     }
     else{
      setremovemembergroupexistlist(id,groupId)
      if(groupId===Grouppicked.getState().group.groupId){
      setremovemembergrouppicked(id)
      }
      setremovemembersearchgroupexistlist(id,groupId)
      toast.success(message)
     }
  }
  function handledeletegroupleave(id:string,groupId:string){
     if(id===UsercurrentId.getState().name){
      setremovegroupexistlist(groupId)
      setremovesearchgroupexist(groupId)
      setremovegroupsendrequest(groupId,id)
      setremovegrouprecieverequest(groupId,id)
     }
     else{
      setremoveadmingroupexistlist(id,groupId)
      setremovemembergroupexistlist(id,groupId)
      setremoveadmingroupexistlist(id,groupId)
      setremoveadminsearchgroupexistlist(id,groupId)
      setremovegroupsendrequest(groupId,id)
      setremovegrouprecieverequest(groupId,id)
      if(groupId===Grouppicked.getState().group.groupId){
        setremovemembergrouppicked(id)
        setremovegroupadmin(id)
      }
     }
  }
  function handlegrouptyping(id:string,name:string,status:"admin"|"member",online:boolean,typing:boolean){
    setgrouptypingstatus(typing,id)
  }
  function handlechangegroupnametoast(message:string){
     toast.success(message)
  }
  function handlechangegroupname(groupId:string,message:string,name:string,id:string){
    if(id===UsercurrentId.getState().name){
      toast.success("name change successfull")
      setgroupname(name)
    }
    else{
      toast.success("Name of group has been changed")
      setgroupname(name)
    }
    
  }
  function handlegrouppagination(hasMore:boolean,cursorId:string,conversations:groupconversations[]){
    if(hasMore&&cursorId&&conversations){
        setgrouphasmore(hasMore)
        setgroupcursorId(cursorId)
        setgrouppagimessages(conversations)
    }
  }
  function handlerejectgrouprequest(id:string,type:string,groupId:string,message:string,status:status){
    if(type==="sender"){
      setstatussendgrouprequest(status,groupId,id)
      toast.error(message)
    }
    else if(type==="reciever"){
      setstatusrecievegrouprequest(status,groupId,id)
      toast.error(message)
    }
  }
  function handlegroupsenderrequestcancelreciever(id:string,status:status,groupId:string,message:string){
    setstatusrecievegrouprequest(status,groupId,id)
    toast.error(message)
  }
  function handlegroupsenderrequestcancelsender(status:status,groupId:string,message:string){
    setstatussendgrouprequest(status,groupId,UsercurrentId.getState().name)
    toast.error(message)
  }
  function handlegrouptypingonlinelist(list:grouponlinetyping,groupId:string){
    if(Grouppicked.getState().group.groupId===groupId){
      setgrouptypingonlinelist(list)
    }
  }
  function handlegroupmessagestatuschange(groupId:string,messageId:string,status:grpconversations){
    setgroupmessagestatuschange(messageId,status)
    toast.success("status of message changed")
  }
  function handlegroupmessageedit(globalId:string,editmessage:string,sender:boolean){
    setgroupconversationmessageedit(globalId,editmessage)
    if(sender){
      toast.success("Message edit succesfull")
    }
  }
  function handlegrouptypingonlinetyping(groupId:string,status:boolean,id:string){
    if(Grouppicked.getState().group.groupId===groupId)
    setgrouptypingstatus(status,id)
  }
  function handlegroupmemberstatuschange(message:string,id:string,status:promote){
    if(status==="admin"){
      setaddgroupadmin(id,"")
    }
    else if(status==="member"){
      setremovegroupadmin(id)
    }
    toast.success(message)
  }
  function handlegroupmemberblockchange(memberId:string,action:"block"|"unblock"){
    if(action==="block"){
      setgroupblockmember(memberId)
    }
    else if(action==="unblock"){
      setgroupunblockmember(memberId)
    }
  }
  function handlegroupsettingschange(settings:groupsettings,value:boolean,message:string){
    if(settings==="OnlyAdminCanEditInfo")
    setgroupsettings(1,value)
    if(settings==="OnlyAdminCanEditMessage")
    setgroupsettings(0,value)

    toast.success(message)
  }
  function handlesendergroupsettingschange(settings:groupsettings,value:boolean,message:string){
    if(settings==="OnlyAdminCanEditInfo"){
      setgroupsettings(1,value)
    }
    if(settings==="OnlyAdminCanEditMessage"){
      setgroupsettings(0,value)
    }
    toast.success(message)
  }
  function handleloadgroupexistlist(grouplist:groupsexistlist[]){
    setaddgroupsexistlist(grouplist)
    setreloadgrpexistlist(true)
  }
  function handleloadgrouprequestrecieve(grouprequestrecieve:grouprequest[]){
    setrecievegrouprequests(grouprequestrecieve)
    setreloadgrprequestsrecieve(true)
  }
  function handleloadgrouprequestsend(grouprequestsend:grouprequest[]){
    setgroupsendrequests(grouprequestsend)
    setreloadgrprequestssend(true)
  }
  function handleloadonetooneconversationrequests(onetooneconversationrecieverequests:onetoonerequest[],onetooneconversationsendrequests:onetoonerequest[]){
    setonetooneconversationsendrequests(onetooneconversationsendrequests)
    setonetooneconversationrecieverequests(onetooneconversationrecieverequests)
    setreloadonetoonerequests(true)
  }
  function handlesendergroupmemberstatuschange(message:string,id:string,status:promote){
    if(status==="admin"){
      setaddgroupadmin(id,"")
    }
    else if(status==="member"){
      setremovegroupadmin(id)
    }
  }
  function handlegroupdescriptionchange(sender:boolean,description:string,message:string){
    setgroupdescription(description)
    toast.success(message)
  }
  socketinstanceref.onmessage=(eventt)=>{
   const {event,payload}=JSON.parse(eventt.data)
   if(event==="login:request:response"){
    const {verify}=payload
    if(verify){
      const fucnctions=Listeners.get("login/register")
      fucnctions?.forEach((value)=>{
        value(verify)
      })
    }
  }
  if(event==="register:request:response"){
    const {verify}=payload
    const functions=Listeners.get("login/register")
    functions?.forEach((value)=>{
      value(verify)
    })
  }
  if(event==="search:response"){
    const {users,message}=payload
    if(!users.length&&message==="No user found"){
      handlemessage()
    }
    else if(users.length){
      setmessage(`${users.length} similar users found`)
      setuserlist(users)
    }
  }
  if(event==="request:response:sender:onetooneconversation"){
    const {message}=payload
    handletoast(message)
  }
  if(event==="request:response:reciever:onetooneconversation"){
    const {request}=payload
    setonetooneconversationrequest(request)
    handlerecievertoast()
  }
  if(event==="request:response:sender:successfull:onetooneconversation"){
    const {message}=payload
    handlesendertoast(message)
  }
  if(event==="request:response:sender:accepted:onetooneconversation"){
    const {message,senderId,recieverId,userr}=payload
    handlesenderacceptedtoast(message)
    setmarkonetooneconversationsendrequest(senderId,recieverId,"accepted")
    handleremoveonetooneconversationrequest(senderId,recieverId)
    handleaddexistuser(userr)
    setuserexistmessage(`${existuserlist.length+1} conversation exists`)
  }
  if(event==="request:response:reciever:accepted:onetooneconversation"){
    const {senderId,recieverId,message,userr}=payload
    handlerecieveracceptedtoast(message)
    setmarkonetooneconversationrequest(senderId,recieverId,"accepted")
    handleaddexistuser(userr)
    setuserexistmessage(`${existuserlist.length} conversation exists`)
    handleremoveonetooneconversationrecrequest(senderId)
  }
  if(event==="request:response:sender:rejected:onetooneconevrsation"){
    const {senderId,recieverId,message}=payload
    handlesenderrejectedtoast(message)
    setmarkonetooneconversationsendrequest(senderId,recieverId,"deleted")
  }
  if(event==="request:response:reciever:rejected:onetooneconversation"){
    const {senderId,recieverId,message}=payload
    handlerecieverrejectedtoast(message)
    setmarkonetooneconversationsendrequest(senderId,recieverId,"deleted")
  }
  if(event==="request:response:conversation:onetooneconversations"){
    const {onetooneconversationsdetails,senderId,recieverId,cursor_id,hasMore,messages_seen}=payload
    setonetooneconversationdetails(onetooneconversationsdetails)
    setparamkey(getkey(senderId,recieverId))
    setcursorid(cursor_id)
    sethasmore(hasMore)
    setuserexistlistunredmessages(messages_seen.unred_messages,senderId)
    setuserexistlistseenmessages(messages_seen.seen,senderId)
    }
  if(event==="message:response:sent:onetooneconversation"){
    const {senderId,recieverId,createdAt,message,_id,status,senderwho,global_id,messages_seen,replyto,attachment}=payload
    handleonetooneconversationmessages(senderId,recieverId,createdAt,message,_id,status,senderwho,global_id,messages_seen,replyto,attachment)
  }
  if(event==="message:response:deleted:onetooneconversation"){
    const {message,createdAt,_id,senderwho,globalId}=payload
    handleonetooneconversationdeletedmessages(message,createdAt,_id,senderwho,globalId)
  }
  if(event==="message:response:view:onetooneconversation"){
    const {global_id,status,messages_seen,_id,senderId}=payload
    handleonetooneconversationviewmessages(global_id,status,messages_seen,_id,senderId)
  }
  if(event==="message:response:unreadcount:onetooneconversation"){
    const {_id,unred_messages}=payload
    setuserexistlistunredmessages(unred_messages,_id)
  }
  if(event==="message:response:typing:onetooneconversation"){
    const {id,typing}=payload
    handletypingonetooneconversation(id,typing)
  }
  if(event==="message:response:loadmore:conversations"){
    const {data}=payload
    handleloadmoreonetooneconversations(data.hasMore,data.cursor_id,data.messages)
  }
  if(event==="login:response:existlist:onetooneconversation"){
    const {users}=payload
    setuserexistlist(users)
  }
  if(event==="login:response:requests:onetooneconversation"){
    const {request_send,request_recieve}=payload
    setonetooneconversationsendrequest(request_send)
    setonetooneconversationrecieverequest(request_recieve)
  }
  if(event==="message:response:cursorid"){
    const {cursor_id}=payload
    setcursorid(cursor_id)
  }
  if(event==="request:response:onetooneconversation:leave"){
    const {senderId,recieverId,_id,message}=payload
    setremoveuserexistlist(_id)
    setparamkey("")
    handleleaveconversationtoast(message)
  }
  if(event==="message:response:deleteforme:onetooneconversation"){
    const {message,messageId,status}=payload
    handledeleteformetoast(message,messageId,status)
  }
  if(event==="request:response:namechange:onetooneconversation"){
    const {message,_id,name}=payload
    handlenamechangeonetooneconversation(message,_id,name)
  }
  if(event==="request:response:descriptionchange:onetooneconversation"){
    const {message,_id,description}=payload
    handledescriptionchangeonetooneconversation(message,_id,description)
  }
  if(event==="user:status:logout:onetooneconversation"){
    const {id,date}=payload
    handlelogoutonetooneconversation(id,date)
  }
  if(event==="user:status:onetooneconversation"){
    const {id,online}=payload
    handleonlinestatusonetooneconversation(id,online)
  }
  if(event==="request:response:userexist"){
    const {users}=payload
    setusersexistlist(users)
  }
  if(event==="message:response:sent:edit:onetooneconversation"){
    const {global_id,message,_id}=payload
    handleeditmessageonetooneconversation(global_id,message,_id)
  }
  if(event==="request:response:groups:search"){
    const {groups,message}=payload
    if(groups.length<=0){
      handlenogrouptoast(message)
    }
    else{
      handlesearchgroupexistlist(groups,message)
    }
  }
  if(event==="request:response:statuschange:group"){
    const {groupId,status,message}=payload
    if(message==="An error occurred"){
      handletoaststatuserrorchange(message)
    }
    else{
      handlegroupstatuschange(groupId,status)
    }
  }
  if(event==="request:response:sendgrouprequest:group"){
    const {message,request}=payload
    if(message!=="Error"){
    handlesendgrouprequest(message,request)
    }
    else{
      toast.error("Some error occurred")
    }
  }
  if(event==="request:response:recieve:sendgrouprequest:group"){
    const {message,request}=payload
    handlerecievegrouprequest(message,request)
  }
  if(event==="request:response:reciever:grouprequestaccept:group"){
    const {message,groupId,member,status}=payload
    if(message!=="Success"){
      handlerecievergrouprequesterror(message)
    }
    else{
      handlerecievergrouprequestaccept(groupId,member,status)
    }
  }
  if(event==="request:response:sender:grouprequestaccept:group"){
    const {group,groupId,sendBy,status,message}=payload
    if(message!=="Success"){
      handlesendergrouprequesterror(message)
    }
    else{
      handlesendergrouprequestaccept(group,groupId,sendBy,status)
    }
  }
  if(event==="request:response:creategroup"){
    const {message,group}=payload
    if(message!=="Success"){
      handlecreategrouperror(message)
    }
    else{
      handlecreategroup(group)
    }
  }
  if(event==="request:response:sendgroupinviterequest:group"){
    const {message,request}=payload
    if(message!=="Error"){
    if(message!=="Request already send"){
      handlegroupinviterequestalreadysend(message)
    }
    else{
      handlegroupinviterequestsend(request,message)
    }
  }
  else{
    toast.error("Some error occurred")
  }
  }
  if(event==="request:response:recieve:sendgroupinviterequest:group"){
    const {request,message}=payload
    handlegroupinviterequestrecieve(request,message)
  }
  if(event==="request:response:groupinviteaccept:group"){
    const {groupId,sendBy,sendTo,name,group,message}=payload
    if(usercurrentid===sendTo){
      if(message==="You accepted request"){
      handlegroupinviteacceptsendto(groupId,sendBy,group,message)
      }
      else{
        toast.error(message)
      }
    }
    else if(usercurrentid===sendBy){
      if(message==="Your invite got accepted"){
      handlegroupinviteacceptsendby(groupId,sendTo,message)
      }
      else{
        toast.error(message)
      }
    }
  }
  if(event==="request:response:groupconversations:group"){
    const {group,groupmessages,message}=payload
    if(message!=="Group dosent exist anymore"){
      handlegroupconversation(group,groupmessages)
    }
    else{
      toast.error(message)
    }
  }
  if(event==="request:response:sendmessage:group"){
    const {message,conversation}=payload
    if(message!=="Success"){
      handlegroupsendmessagetoast(message)
    }
    else{
      handlegroupsendmessage(conversation,message)
    }
  }
  if(event==="request:response:viewmessage:group"){
    const {groupId,globalId,messageId}=payload
    handleviewgroupmessage(groupId,globalId,messageId)
  }
  if(event==="request:response:changememberstatus:group"){
    const {status,message,promoteId,extramessage,name}=payload
    if(message!=="Success"){
      handlechangememberstatustoast(message)
    }
    else{
      handlechangememberstatus(promoteId,status,name,extramessage)
    }
  }
    if(event==="request:response:kickmember:group"){
      const {Success,message,groupId,id}=payload
      if(!Success){
        toast.error(message)
      }
      else{
        handlekickmember(id,groupId,message)
      }
    }
    if(event==="request:response:leavegroup:group"){
      const {id,deletee,groupId}=payload
      if(deletee){
        handledeletegroupleave(id,groupId)
      }
      else{
        handlememberleavegroup(id,groupId)
      }
    }
    if(event==="request:response:grouptyping:group"){
      const {id,name,status,online,typing}=payload
        handlegrouptyping(id,name,status,online,typing)
    }
    if(event==="request:response:changename:group"){
      const {groupId,message,name,id}=payload
      if(message!=="Success"){
        handlechangegroupnametoast(message)
      }
      else{
        handlechangegroupname(groupId,message,name,id)
      }
    }
    if(event==="request:response:pagimoremessage:group"){
      const {hasMore,cursorId,pagiconversations}=payload
      handlegrouppagination(hasMore,cursorId,pagiconversations)
    }
    if(event==="request:response:grouprequestrejectrequest:group"){
      const {id,type,groupId,message,status}=payload
      handlerejectgrouprequest(id,type,groupId,message,status)
    }
    if(event==="request:response:reciever:groupsenderrequestcancel:group"){
      const {id,status,groupId,message}=payload
      handlegroupsenderrequestcancelreciever(id,status,groupId,message)
    }
    if(event==="request:response:sender:groupsenderrequestcancel:group"){
      const {status,groupId,message}=payload
      handlegroupsenderrequestcancelsender(status,groupId,message)
    }
    if(event==="request:response:grouptypingonline:group"){
      const {memberstatus,groupId}=payload
      handlegrouptypingonlinelist(memberstatus,groupId)
    }
    if(event==="request:response:messagestatuschange:group"){
      const {message,groupId,messageId,status}=payload
      if(message==="Success"){
        handlegroupmessagestatuschange(groupId,messageId,status)
      }
    }
    if(event==="request:response:editmessage:group"){
      const {globalId,editmessage,sender,message}=payload
       if(message){
        toast.error(message)
       }
       else{
        handlegroupmessageedit(globalId,editmessage,sender)
       }
    }
    if(event==="request:response:grouptypingonlinetyping:group"){
      const {groupId,status,id}=payload
      handlegrouptypingonlinetyping(groupId,status,id)
    }
    if(event==="request:response:memberstatus:group"){
      const {Success,message,id,status}=payload
      if(Success){
        handlegroupmemberstatuschange(message,id,status)
      }
      else{
        toast.error(message)
      }
    }
    if(event==="request:response:block:group"){
      const {Success,message,memberId,action}=payload
      if(Success){
        handlegroupmemberblockchange(memberId,action)
        toast.success(message)
      }
      else{
        toast.error(message)
      }
    }
    if(event==="request:response:sender:memberstatus:group"){
      const {Success,message,id,status}=payload
      if(Success){
        handlesendergroupmemberstatuschange(message,id,status)
      }
      else{
        toast.error(message)
      }
    }
    if(event==="request:response:groupsettings:group"){
      const {settings,value,message}=payload
      handlegroupsettingschange(settings,value,message)
    }
    if(event==="request:response:sender:groupsettings:group"){
      const {settings,value,message}=payload
      handlesendergroupsettingschange(settings,value,message)
    }
    if(event==="request:response:reload:groupexistlist:group"){
      const {grouplist}=payload
      handleloadgroupexistlist(grouplist)
    }
    if(event==="request:response:reload:grouprequestrecieve:group"){
      const {grouprequestsrecieve}=payload
      handleloadgrouprequestrecieve(grouprequestsrecieve)
    }
    if(event==="request:response:reload:grouprequestsend:group"){
      const {grouprequestsend}=payload
      handleloadgrouprequestsend(grouprequestsend)
    }
    if(event==="request:response:reload:onetooneconversationrequests:onetooneconversation"){
      const {onetooneconversationrecieverequests,onetooneconversationsendrequests}=payload
      handleloadonetooneconversationrequests(onetooneconversationrecieverequests,onetooneconversationsendrequests)
    }
    if(event==="request:response:groupdescription:group"){
      const {Success,sender,description,message}=payload
      if(Success){
        handlegroupdescriptionchange(sender,description,message)
      }
      else{
        toast.error(message)
      }
    }
    if(event==="request:response:reload:conversation:onetooneconversation"){
      const {onetooneconversations}=payload
      setuserexistlistt(onetooneconversations)
    }
  }
  return socketinstanceref
}

export function on(type:string,funtion:Listener){
  const method=Listeners.get(type)||[]
  Listeners.set(type,[...method,funtion])
}
export function set(type:string,dataa:any){
  if(!socketinstanceref){
    socketinstanceref=socket()
  }

  if(socketinstanceref.readyState===WebSocket.OPEN){
    socketinstanceref.send(JSON.stringify({event:type,payload:dataa}))
  } else {
    socketinstanceref.onopen = () => {
      socketinstanceref?.send(JSON.stringify({event:type,payload:dataa}))
    }
  }
}
    
