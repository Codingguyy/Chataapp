"use client"
import Getsngleuser from "@/actions/getsngleuser"
import { Popover } from "./ui/popover"
import { PopoverTrigger } from "./ui/popover"
import { PopoverContent } from "./ui/popover"
import { Button } from "./ui/button"
import { ScrollArea } from "./ui/scroll-area"
import { Dialog } from "./ui/dialog"
import { DialogTrigger } from "./ui/dialog"
import { DialogContent } from "./ui/dialog"
import { DialogHeader } from "./ui/dialog"
import { DialogTitle } from "./ui/dialog"
import { DialogDescription } from "./ui/dialog"
import { Badge } from "./ui/badge"
import { Spinner } from "./ui/spinner"
import { Inbox, Check, X, Info } from "lucide-react"
import { Onetooneconversationrequest } from "./store"
import { Toklue } from "./store"
import { Requestsngleuser } from "./store"
import { set } from "@/socketserver/clientsidesocket"
import { requesttype } from "@/types/1to1conversations"

export default function Request() {
  const onetooneconversationrequest = Onetooneconversationrequest(s => s.requsts)
  const toklue = Toklue(s => s.name)
  const sngleuserdetails = Requestsngleuser(s => s.user)
  const setsngleuserdetails = Requestsngleuser(s => s.setuser)
  const isloading = Requestsngleuser(s => s.isloading)
  const setisloading = Requestsngleuser(s => s.setisloading)

  function handleonetooneconversationrequest(senderId: string, recieverId: string, requsttype: requesttype) {
    if (requsttype === "accepted") {
      set("request:accepted:onetooneconversation", { senderId: senderId, recieverId: recieverId, token: toklue })
    } else if (requsttype === "reject") {
      set("request:rejected:onetooneconversation", { senderId: senderId, recieverId: recieverId, token: toklue })
    }
  }

  async function handlegetuserdetails(value: string) {
    setisloading(true)
    const userdetails = await Getsngleuser(value)
    const timer = setTimeout(() => { setisloading(false) }, 3000)
    if (userdetails.name && userdetails.email) {
      clearTimeout(timer)
      setsngleuserdetails(userdetails)
      setisloading(false)
    } else {
      setsngleuserdetails({ name: "", email: "" })
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-white/60 hover:text-white hover:bg-white/[0.06] text-xs font-medium transition-colors w-full sm:w-auto text-left">
          <Inbox size={14} />
          <span>Received</span>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[520px] bg-[#141414] border-white/10 text-white">
        <DialogHeader>
          <DialogTitle className="text-white">Requests received</DialogTitle>
          <DialogDescription className="text-white/40">Requests you've received from other users</DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[320px] w-full pr-2">
          {onetooneconversationrequest.length === 0 ? (
            <div className="h-[280px] flex flex-col items-center justify-center text-white/20 gap-2">
              <Inbox size={28} />
              <p className="text-sm">No requests received</p>
            </div>
          ) : (
            <div className="space-y-2">
              {onetooneconversationrequest.map((data, i) => (
                <div key={i} className="flex items-center gap-3 px-3 py-3 rounded-lg bg-white/[0.04] border border-white/[0.06]">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{data.senderId}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[11px] text-white/40">{new Date(data.sendAt).toLocaleDateString()}</span>
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-0 bg-amber-500/15 text-amber-400">{data.status}</Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Popover>
                      <PopoverTrigger asChild>
                        <button
                          className="h-7 w-7 rounded-md bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors"
                          onClick={(e) => { e.stopPropagation(); handlegetuserdetails(data.senderId) }}
                        >
                          <Info size={13} />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="bg-[#1a1a1a] border-white/10 text-white w-[260px]">
                        {isloading ? (
                          <div className="flex items-center gap-2 text-white/50 text-sm py-2"><Spinner /> Loading…</div>
                        ) : sngleuserdetails.email && sngleuserdetails.name ? (
                          <div className="space-y-1">
                            <p className="text-xs text-white/40 uppercase tracking-wide">Sender details</p>
                            <p className="text-sm text-white">{sngleuserdetails.name}</p>
                            <p className="text-xs text-white/50">{sngleuserdetails.email}</p>
                          </div>
                        ) : (
                          <p className="text-sm text-white/40 py-2">No user found</p>
                        )}
                      </PopoverContent>
                    </Popover>
                    <button
                      className="h-7 w-7 rounded-md bg-red-500/10 hover:bg-red-500/20 flex items-center justify-center text-red-400 transition-colors"
                      onClick={(e) => { e.stopPropagation(); handleonetooneconversationrequest(data.senderId, data.recieverId, "reject") }}
                    >
                      <X size={13} />
                    </button>
                    <button
                      className="h-7 w-7 rounded-md bg-emerald-500/10 hover:bg-emerald-500/20 flex items-center justify-center text-emerald-400 transition-colors"
                      onClick={(e) => { e.stopPropagation(); handleonetooneconversationrequest(data.senderId, data.recieverId, "accepted") }}
                    >
                      <Check size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
