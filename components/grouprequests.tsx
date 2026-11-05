"use client"
import { Dialog } from "./ui/dialog"
import { DialogTrigger } from "./ui/dialog"
import { DialogHeader } from "./ui/dialog"
import { DialogTitle } from "./ui/dialog"
import { DialogDescription } from "./ui/dialog"
import { DialogContent } from "./ui/dialog"
import { Tabs } from "./ui/tabs"
import { TabsList } from "./ui/tabs"
import { TabsContent } from "./ui/tabs"
import { TabsTrigger } from "./ui/tabs"
import { Popover } from "./ui/popover"
import { PopoverTrigger } from "./ui/popover"
import { PopoverContent } from "./ui/popover"
import { ScrollArea } from "./ui/scroll-area"
import { Badge } from "./ui/badge"
import { Groupsendrequest } from "./store"
import { Grouprecieverequest } from "./store"
import { Toklue } from "./store"
import { UserPlus, MoreHorizontal, Inbox } from "lucide-react"
import { status } from "@/types/1to1conversations"
import { set } from "@/socketserver/clientsidesocket"
import { RequestType } from "@/types/groupconversations"

export default function Grouprequests() {
  const groupsendrequest = Groupsendrequest(s => s.requests)
  const grouprecieverequest = Grouprecieverequest(s => s.requests)
  const toklue = Toklue(s => s.name)

  function handlerejectrequest(groupId: string, status: status, type: RequestType) {
    if (groupId && status) {
      set("request:groupsenderrequestcancel:group", { groupId: groupId, status: status, token: toklue, type: type })
    }
  }
  function handleacceptrequest(groupId: string, sendId: string) {
    if (groupId && sendId) {
      set("request:grouprequestaccept:group", { groupId: groupId, sendBy: sendId, token: toklue })
    }
  }
  function handleseedetails() { }
  function getstatus(value: status) {
    if (value === "accepted") return <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-0 bg-emerald-500/15 text-emerald-400">Accepted</Badge>
    if (value === "deleted") return <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-0 bg-red-500/15 text-red-400">Deleted</Badge>
    if (value === "pending") return <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-0 bg-amber-500/15 text-amber-400">Pending</Badge>
  }
  function handlerejectrequst(groupId: string, sendBy: string) {
    if (groupId && sendBy) {
      set("request:grouprecieverejectrequest:group", { groupId: groupId, sendBy: sendBy, token: toklue })
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-white/60 hover:text-white hover:bg-white/[0.06] text-xs font-medium transition-colors w-full sm:w-auto text-left">
          <UserPlus size={14} />
          <span>Group requests</span>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[560px] bg-[#141414] border-white/10 text-white">
        <DialogHeader>
          <DialogTitle className="text-white">Group requests</DialogTitle>
          <DialogDescription className="text-white/40">Group requests received and sent</DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="Send">
          <TabsList variant="line" className="border-white/10">
            <TabsTrigger value="Send" className="text-white/50 data-[state=active]:text-white">Sent</TabsTrigger>
            <TabsTrigger value="Recieve" className="text-white/50 data-[state=active]:text-white">Received</TabsTrigger>
          </TabsList>

          <TabsContent value="Send" className="pt-2">
            <ScrollArea className="h-[280px] pr-2">
              {groupsendrequest?.length ? (
                <div className="space-y-2">
                  {groupsendrequest.map((data, i) => (
                    <div key={i} className="flex items-center gap-3 px-3 py-3 rounded-lg bg-white/[0.04] border border-white/[0.06]">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">Group {data.groupId}</p>
                        <div className="mt-1">{getstatus(data.status)}</div>
                      </div>
                      <Popover>
                        <PopoverTrigger asChild>
                          <button className="h-7 w-7 rounded-md bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors">
                            <MoreHorizontal size={14} />
                          </button>
                        </PopoverTrigger>
                        <PopoverContent className="bg-[#1a1a1a] border-white/10 text-white w-[240px] space-y-3">
                          {data.status === "pending" && (
                            <button
                              className="w-full text-left text-sm text-red-400 hover:text-red-300 transition-colors"
                              onClick={(e) => { e.stopPropagation(); handlerejectrequest(data.groupId, data.status, data.type) }}
                            >
                              Cancel request
                            </button>
                          )}
                          <div className="border-t border-white/10 pt-3 space-y-1.5">
                            <p className="text-[10px] text-white/30 uppercase tracking-wide">Details</p>
                            <p className="text-xs text-white/60">Sent by: <span className="text-white/80">{data.sendBy.name}</span></p>
                            <p className="text-xs text-white/60">Group: <span className="text-white/80">{data.groupId}</span></p>
                            <p className="text-xs text-white/60">Sent at: <span className="text-white/80">{new Date(data.sendAt).toDateString()}</span></p>
                            <p className="text-xs text-white/60">Type: <span className="text-white/80">{data.type}</span></p>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-[240px] flex flex-col items-center justify-center text-white/20 gap-2">
                  <Inbox size={28} />
                  <p className="text-sm">No requests sent</p>
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="Recieve" className="pt-2">
            <ScrollArea className="h-[280px] pr-2">
              {grouprecieverequest?.length ? (
                <div className="space-y-2">
                  {grouprecieverequest.map((data, i) => (
                    <div key={i} className="flex items-center gap-3 px-3 py-3 rounded-lg bg-white/[0.04] border border-white/[0.06]">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">Group {data.groupId}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[11px] text-white/40">{new Date(data.sendAt).toLocaleDateString()}</span>
                          {getstatus(data.status)}
                        </div>
                      </div>
                      <Popover>
                        <PopoverTrigger asChild>
                          <button className="h-7 w-7 rounded-md bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors">
                            <MoreHorizontal size={14} />
                          </button>
                        </PopoverTrigger>
                        <PopoverContent className="bg-[#1a1a1a] border-white/10 text-white w-[200px] space-y-2">
                          {data.status === "pending" ? (
                            <>
                              <button
                                className="w-full text-left text-sm text-red-400 hover:text-red-300 transition-colors"
                                onClick={(e) => { e.stopPropagation(); handlerejectrequst(data.groupId, data.sendBy.id) }}
                              >
                                Reject
                              </button>
                              <button
                                className="w-full text-left text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
                                onClick={(e) => { e.stopPropagation(); handleacceptrequest(data.groupId, data.sendBy.id) }}
                              >
                                Accept
                              </button>
                            </>
                          ) : (
                            <p className="text-xs text-white/30 px-1 py-1">Already {data.status}</p>
                          )}
                        </PopoverContent>
                      </Popover>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-[240px] flex flex-col items-center justify-center text-white/20 gap-2">
                  <Inbox size={28} />
                  <p className="text-sm">No requests received</p>
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
