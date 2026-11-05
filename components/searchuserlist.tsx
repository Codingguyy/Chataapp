"use client"
import { useEffect } from "react"
import Image, { StaticImageData } from "next/image"
import { Userlist } from "./store"
import { Badge } from "./ui/badge"
import { Popover } from "./ui/popover"
import { PopoverTrigger } from "./ui/popover"
import { PopoverContent } from "./ui/popover"
import { SearchX } from "lucide-react"
import { Spinner } from "./ui/spinner"
import Imagee from '@/images/man.png'
import { Onetooneconversationsendrequest } from "./store"
import { Toklue } from "./store"
import { UsercurrentId } from "./store"
import { Parmkey } from "./store"
import { Switchvalue } from "./store"
import { Searchexistgrouplist } from "./store"
import { Searchloading } from "./store"
import { groupmember } from "@/types/groupconversations"
import { set } from "@/socketserver/clientsidesocket"

export default function Userlistttttt() {
  const users = Userlist(s => s.users)
  const message = Userlist(s => s.message)
  const onetooneconversationsendrequest = Onetooneconversationsendrequest(s => s.requsts)
  const setonetooneconversationsendrequest = Onetooneconversationsendrequest(s => s.setrequests)
  const toklue = Toklue(s => s.name)
  const userid = UsercurrentId(s => s.name)
  const parmkey = Parmkey(s => s.name)
  const grouporonetoone = Switchvalue(s => s.value)
  const searchgroupexistlist = Searchexistgrouplist(s => s.groups)
  const usercurrentid = UsercurrentId(s => s.name)
  const searchloading = Searchloading(s => s.value)
  const setsearchloading = Searchloading(s => s.setvlue)

  function gettext(value: string, valuee: string) {
    if (value === "send") {
      return <span className="text-white/30 text-xs">Request sent</span>
    } else if (value === "recieved") {
      return (
        <div className="flex flex-col items-end gap-1.5">
          <span className="text-white/30 text-xs">Request received</span>
          <button className="text-[11px] px-2.5 py-1 rounded-md bg-white/[0.06] text-white/60 hover:text-white hover:bg-white/10 transition-colors">See requests</button>
        </div>
      )
    } else {
      return (
        <button
          className="text-xs px-3 py-1.5 rounded-md bg-indigo-500 text-white hover:bg-indigo-600 transition-colors font-medium"
          onClick={(e) => { e.stopPropagation(); handlerequestfor1to1conversation(userid, valuee) }}
        >
          Send request
        </button>
      )
    }
  }

  function handlerequestfor1to1conversation(senderId: string, recieverId: string) {
    set("request:onetooneconversation", { token: toklue, senderId: senderId, recieverId: recieverId })
    if (!onetooneconversationsendrequest.find(data => (data.recieverId === recieverId && data.senderId === senderId))) {
      setonetooneconversationsendrequest({ senderId: senderId, recieverId: recieverId, sendAt: new Date(), status: "pending" })
    }
  }

  function getbadge(value: groupmember[]) {
    if (value?.some(data => data.id === usercurrentid)) return "Admin"
    return "No member"
  }

  function handlesendgrouprequest(groupId: string) {
    set("request:sendgrouprequest:group", { groupId: groupId, token: toklue, status: "pending", type: "group_join_request" })
  }

  useEffect(() => { setsearchloading(false) }, [users, searchgroupexistlist])

  return (
    <>
      {searchloading ? (
        <div className="flex-1 h-full w-full flex flex-col">
          <div className="w-full px-4 py-3 flex items-center gap-2 text-xs text-white/40">
            <Spinner />
            <span>Searching…</span>
          </div>
          <div className="flex flex-col gap-2 px-3 pb-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="flex items-center gap-3 rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-2.5 animate-pulse">
                <div className="h-11 w-11 rounded-full bg-white/[0.06] flex-shrink-0" />
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="h-3 w-1/3 rounded bg-white/[0.08]" />
                  <div className="h-2.5 w-1/2 rounded bg-white/[0.05]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (users.length || searchgroupexistlist) ? (
        <div className="flex-1 h-full w-full flex flex-col">
          <div className="w-full px-4 py-3 text-xs text-white/40">{message}</div>
          <div className="flex flex-col gap-2 px-3 pb-4">
            {grouporonetoone ? (
              searchgroupexistlist.map(data => (
                <Popover key={data.groupId}>
                  <div className="rounded-lg border border-white/[0.06] bg-white/[0.03] hover:bg-white/[0.05] transition-colors px-3 py-2.5">
                    <div className="flex items-center gap-3">
                      <Image src={Imagee} alt="Group" className="h-11 w-11 rounded-full object-cover flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h2 className="text-sm font-medium text-white truncate">{data.name}</h2>
                          <Badge
                            variant="outline"
                            className={`text-[9px] px-1.5 py-0 border-0 flex-shrink-0 ${data.status === "active" ? "bg-emerald-500/15 text-emerald-400" : "bg-red-500/15 text-red-400"}`}
                          >
                            {data.status}
                          </Badge>
                        </div>
                        <p className="text-[11px] text-white/40 truncate mt-0.5">{data.description || "No description"}</p>
                        <span className="text-[10px] text-white/30">{data.member_no} members</span>
                      </div>
                      <PopoverTrigger asChild>
                        <button className="h-8 px-3 rounded-md bg-indigo-500 text-white text-xs font-medium hover:bg-indigo-600 transition-colors flex-shrink-0">
                          Join
                        </button>
                      </PopoverTrigger>
                    </div>
                  </div>

                  <PopoverContent align="end" className="w-[260px] bg-[#1a1a1a] border-white/10 text-white p-4">
                    <div className="space-y-3">
                      <div>
                        <h3 className="text-sm font-semibold text-white">Join {data.name}?</h3>
                        <p className="mt-1 text-xs text-white/40 leading-relaxed">A join request will be sent to the admins of this group.</p>
                      </div>
                      <div className="rounded-lg bg-white/[0.05] p-2.5 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-white/40">Group code</span>
                          <span className="font-mono tracking-wider text-white">{data.code}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-white/40">Created</span>
                          <span className="text-white">{new Date(data.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex gap-2 pt-1">
                        <button className="flex-1 h-8 rounded-lg border border-white/10 text-xs text-white/60 hover:bg-white/[0.06] transition-colors">
                          Cancel
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handlesendgrouprequest(data.groupId) }}
                          className="flex-1 h-8 rounded-lg bg-indigo-500 text-white text-xs hover:bg-indigo-600 transition-colors"
                        >
                          Send request
                        </button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              ))
            ) : (
              users.map(data => (
                <div key={data._id} className="flex items-center gap-3 rounded-lg border border-white/[0.06] bg-white/[0.03] hover:bg-white/[0.05] transition-colors px-3 py-2.5">
                  <Image src={Imagee} alt="avatar" className="h-11 w-11 rounded-full object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{data.name}</p>
                    {userid === data._id ? (
                      <Badge variant="outline" className="text-[9px] px-1.5 py-0 border-0 bg-emerald-500/15 text-emerald-400 mt-0.5">You</Badge>
                    ) : (
                      <p className="text-xs text-white/40 truncate">{data.email}</p>
                    )}
                  </div>
                  <div className="flex-shrink-0">{gettext(data.request_send, data._id)}</div>
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        <div className="h-full w-full flex items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-white/20">
            <SearchX size={40} />
            <span className="text-sm">{message}</span>
          </div>
        </div>
      )}
    </>
  )
}
