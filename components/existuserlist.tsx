"use client"
import Image from "next/image"
import { useEffect } from "react"
import { Button } from "./ui/button"
import { ButtonGroup } from "./ui/button-group"
import { Badge } from "./ui/badge"
import { Collapsible } from "./ui/collapsible"
import { CollapsibleTrigger } from "./ui/collapsible"
import { CollapsibleContent } from "./ui/collapsible"
import { Userexistlistt } from "./store"
import { Toklue } from "./store"
import { Currentselecteduserconversationname } from "./store"
import { Conversationpagination } from "./store"
import { Chatypeose } from "./store"
import { Groupexists } from "./store"
import { Chatypepicked } from "./store"
import { UsercurrentId } from "./store"
import { Reloadeverything } from "./store"
import { Onlinestatusmap } from "./store"
import { ArrowBigRight, ChevronRight, ChevronDown, Users, MessageCircle } from "lucide-react"
import { set } from "@/socketserver/clientsidesocket"
import Imagee from '@/images/man.png'
import { groupmember } from "@/types/groupconversations"
import { grpstatustype } from "@/types/groupconversations"

export default function Existuserlist() {
  const usrsss = Userexistlistt(s => s.users)
  const toklue = Toklue(s => s.name)
  const setcurrentselecteduserconversationname = Currentselecteduserconversationname(s => s.setname)
  const cursorId = Conversationpagination(s => s.cursor_id)
  const chatype = Chatypeose(s => s.type)
  const setchatype = Chatypeose(s => s.setype)
  const groupexistlist = Groupexists(s => s.groups)
  const chatypepicked = Chatypepicked(s => s.type)
  const setchatypepicked = Chatypepicked(s => s.settype)
  const usercurrentid = UsercurrentId(s => s.name)
  const onlinestatuses = Onlinestatusmap(s => s.statuses)
  const reloadgrpexistlist = Reloadeverything(s => s.Grpexistlist)
  const reloadonetooneexistlist = Reloadeverything(s => s.Onetooneexistlist)

  function handleonetooneconversationroom(senderId: string, name: string) {
    setcurrentselecteduserconversationname(name)
    setchatypepicked("dm")
    set("request:conversations:onetooneconversations", { senderId: senderId, token: toklue })
  }

  function handlegroupconversationroom(groupId: string) {
    setchatypepicked("group")
    set("request:groupconversations:group", { groupId: groupId, token: toklue })
  }

  function gettext(value: groupmember[]) {
    if (value.some(data => data.id === usercurrentid)) return "admin"
    return "member"
  }


  useEffect(() => {
    if (usrsss.length) {
      const interval = setInterval(() => {
        usrsss.forEach((value) => {
          set("request:online:onetooneconversation", { token: toklue, id: value._id })
        })
      }, 1500)
      return () => clearInterval(interval)
    }
  }, [usrsss])

  useEffect(() => {
    set("request:reload:groupexistlist:group", { token: toklue })
    set("request:reload:conversation:onetooneconversation", { token: toklue })
  }, [])

  useEffect(() => {
    set("request:reload:grouprequestrecieve:group", { token: toklue })
    set("request:reload:grouprequestsend:group", { token: toklue })
    set("request:reload:onetooneconversationrequests:onetooneconversation", { token: toklue })
  }, [])

  return (
    <div className="flex-1 flex flex-col">
      
      <div className="px-4 py-3">
        <ButtonGroup className="w-full">
          <Button
            variant={"outline"}
            className={`flex-1 text-xs h-8 transition-all ${chatype === "onetoone"
              ? "bg-indigo-500 border-indigo-500 text-white hover:bg-indigo-600 hover:border-indigo-600"
              : "bg-white/[0.04] border-white/10 text-white/50 hover:text-white hover:bg-white/[0.08]"
              }`}
            onClick={(e) => { e.stopPropagation(); setchatype("onetoone") }}
          >
            <MessageCircle size={12} className="mr-1.5" />
            Direct
          </Button>
          <Button
            variant={"outline"}
            className={`flex-1 text-xs h-8 transition-all ${chatype === "group"
              ? "bg-indigo-500 border-indigo-500 text-white hover:bg-indigo-600 hover:border-indigo-600"
              : "bg-white/[0.04] border-white/10 text-white/50 hover:text-white hover:bg-white/[0.08]"
              }`}
            onClick={(e) => { e.stopPropagation(); setchatype("group") }}
          >
            <Users size={12} className="mr-1.5" />
            Groups
          </Button>
        </ButtonGroup>
      </div>

      
      <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-1">
        {chatype === "onetoone" ? (
          <>
            {usrsss.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-white/20">
                <MessageCircle size={32} className="mb-3" />
                <p className="text-sm">No conversations yet</p>
              </div>
            ) : (
              usrsss.map(data => (
                <div
                  key={data._id}
                  className="group flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/[0.05] cursor-pointer transition-colors"
                  onClick={() => handleonetooneconversationroom(data._id, data.name)}
                >
                  <div className="relative flex-shrink-0">
                    <Image src={Imagee} alt="avatar" className="h-9 w-9 rounded-full object-cover" />
                    {onlinestatuses[data._id]?.online && (
                      <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-400 border-2 border-[#111111]" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{data.name}</p>
                    <p className="text-xs text-white/40 truncate">{data.email}</p>
                  </div>
                  {data.unred_messages ? (
                    <span className="flex-shrink-0 h-5 min-w-5 px-1 rounded-full bg-indigo-500 text-white text-[10px] font-semibold flex items-center justify-center">
                      {data.unred_messages}
                    </span>
                  ) : (
                    <ChevronRight size={14} className="text-white/20 group-hover:text-white/40 transition-colors flex-shrink-0" />
                  )}
                </div>
              ))
            )}
          </>
        ) : (
          <>
            {groupexistlist.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-white/20">
                <Users size={32} className="mb-3" />
                <p className="text-sm">No groups yet</p>
              </div>
            ) : (
              groupexistlist.map((data) => (
                <Collapsible key={data.groupId}>
                  <div className="rounded-lg border border-white/[0.06] bg-white/[0.03] hover:bg-white/[0.05] transition-colors overflow-hidden mb-1">
                    <div className="flex items-center gap-3 px-3 py-2.5">
                      <Image src={Imagee} alt="Group" className="h-9 w-9 rounded-full object-cover flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-white truncate">{data.name}</span>
                          <Badge
                            variant="outline"
                            className={`text-[9px] px-1.5 py-0 border-0 flex-shrink-0 ${data.status === "active"
                              ? "bg-emerald-500/15 text-emerald-400"
                              : "bg-red-500/15 text-red-400"
                              }`}
                          >
                            {data.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[11px] text-white/30">{data.member_no} members</span>
                          <span className="text-[10px] text-indigo-400/70 font-medium">{gettext(data.admins_info)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <CollapsibleTrigger asChild>
                          <button className="h-7 w-7 rounded-md bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white/70 transition-colors">
                            <ChevronDown size={12} />
                          </button>
                        </CollapsibleTrigger>
                        <Button
                          variant={"outline"}
                          className="h-7 w-7 p-0 border-white/10 bg-white/[0.04] hover:bg-indigo-500 hover:border-indigo-500 text-white/60 hover:text-white transition-all"
                          onClick={(e) => { e.stopPropagation(); handlegroupconversationroom(data.groupId) }}
                        >
                          <ArrowBigRight size={13} />
                        </Button>
                      </div>
                    </div>

                    <CollapsibleContent>
                      <div className="px-3 pb-3 pt-1 border-t border-white/[0.06] space-y-2">
                        <div>
                          <p className="text-[10px] text-white/30 mb-0.5">Description</p>
                          <p className="text-xs text-white/60">{data.description || "No description"}</p>
                        </div>
                        <div className="flex gap-6">
                          <div>
                            <p className="text-[10px] text-white/30 mb-0.5">Code</p>
                            <p className="text-xs font-mono text-white/70 tracking-wider">{data.code}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-white/30 mb-0.5">Created</p>
                            <p className="text-xs text-white/60">{new Date(data.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>
                    </CollapsibleContent>
                  </div>
                </Collapsible>
              ))
            )}
          </>
        )}
      </div>
    </div>
  )
}
