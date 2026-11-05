"use client"
import { useEffect, useRef, useCallback, useState } from "react"
import { Grouppicked } from "./store"
import { Popover, PopoverTrigger, PopoverContent } from "./ui/popover"
import { Button } from "./ui/button"
import { ScrollArea } from "./ui/scroll-area"
import { Spinner } from "./ui/spinner"
import { MoreVertical, Trash, Trash2, Reply, Edit, Clock, CheckCheck, FileText, Download } from "lucide-react"
import { UsercurrentId } from "./store"
import { Toklue } from "./store"
import { Grouppagination } from "./store"
import { Groupreplymessage } from "./store"
import { GroupuserseenmessageId } from "./store"
import { Editmessage } from "./store"
import { messagestatus } from "@/types/1to1conversations"
import { grpconversations } from "@/types/groupconversations"
import { set } from "@/socketserver/clientsidesocket"
export default function Groupmessagesarea() {

   
    const seenObserverRef = useRef<IntersectionObserver | null>(null)
    const pagiObserverRef = useRef<IntersectionObserver | null>(null)
    const isLoadingRef = useRef(false)
    
    const [isLoading, setIsLoading] = useState(false)
    const hasMoreRef = useRef(false)
    const conversationslengthRef = useRef(0)
    const containerRef = useRef<HTMLDivElement | null>(null)
    const seenObservedIdsRef = useRef<Set<string>>(new Set())
    
    const pagiObservedElRef = useRef<HTMLElement | null>(null)

    const conversations = Grouppicked(s => s.conversations)
    const usercurrentid = UsercurrentId(s => s.name)
    const grouppicked = Grouppicked(s => s.group)
    const token = Toklue(s => s.name)
    const hasMore = Grouppagination(s => s.hasMore)
    const setreplyglobalid = Groupreplymessage(s => s.setglobal_id)
    const setoriginal_message=Groupreplymessage(s=>s.setoriginal_message)
    const groupuserseenmessageid = GroupuserseenmessageId(s => s.name)

    const grouppickedRef = useRef(grouppicked)
    const tokenRef = useRef(token)
    const userIdRef = useRef(usercurrentid)
    const seteditmessage=Editmessage(s=>s.setmessage)
    const seteditglobalId=Editmessage(s=>s.setglobal_id)

    useEffect(() => { grouppickedRef.current = grouppicked }, [grouppicked])
    useEffect(() => { tokenRef.current = token }, [token])
    useEffect(() => { userIdRef.current = usercurrentid }, [usercurrentid])
    useEffect(() => { hasMoreRef.current = hasMore }, [hasMore])
    useEffect(() => { conversationslengthRef.current = conversations.length }, [conversations])

    function geticon(value: grpconversations) {
        if (value === "deleted") return <Trash2 size={11} className="text-red-400" />
    }

    
    useEffect(() => {
        seenObserverRef.current = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return
                const el = entry.target as HTMLElement
                const id = el.getAttribute("data-id")
                const senderId = el.getAttribute("sender-id")

                if (userIdRef.current !== senderId) {
                    set("request:viewmessage:group", {
                        groupId: grouppickedRef.current.groupId,
                        sendBy: senderId,
                        globalId: id,
                        token: tokenRef.current
                    })
                }
               
                seenObserverRef.current?.unobserve(el)
            })
        }, { threshold: 0.6 })

        return () => {
            seenObserverRef.current?.disconnect()
            seenObserverRef.current = null
        }
    }, [])

    useEffect(() => {
        pagiObserverRef.current = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return
                if (isLoadingRef.current || !hasMoreRef.current || conversationslengthRef.current < 50) return

                const el = entry.target as HTMLElement
                const mongoId = el.getAttribute("mongo-id")
                isLoadingRef.current = true
                setIsLoading(true)
                set("request:pagimoremessage:group", {
                    groupId: grouppickedRef.current.groupId,
                    id: mongoId,
                    token: tokenRef.current
                })
               
            })
        }, { threshold: 0.6 })

        return () => {
            pagiObserverRef.current?.disconnect()
            pagiObserverRef.current = null
        }
    }, [])

    
    useEffect(() => {
        isLoadingRef.current = false
        setIsLoading(false)
    }, [conversations])

    
    useEffect(() => {
        if (!containerRef.current) return
        const elements = containerRef.current.querySelectorAll<HTMLElement>("[data-id]")
        if (!elements.length) return

        
        elements.forEach(el => {
            const id = el.getAttribute("data-id")
            if (!id || seenObservedIdsRef.current.has(id)) return
            seenObservedIdsRef.current.add(id)
            seenObserverRef.current?.observe(el)
        })
        const firstEl = elements[0]
        if (pagiObservedElRef.current && pagiObservedElRef.current !== firstEl) {
            pagiObserverRef.current?.unobserve(pagiObservedElRef.current)
        }
        if (pagiObservedElRef.current !== firstEl) {
            pagiObservedElRef.current = firstEl
            pagiObserverRef.current?.observe(firstEl)
        }
    }, [conversations])

   
    useEffect(() => {
        seenObservedIdsRef.current = new Set()
        isLoadingRef.current = false
        setIsLoading(false)
        if (pagiObservedElRef.current) {
            pagiObserverRef.current?.unobserve(pagiObservedElRef.current)
            pagiObservedElRef.current = null
        }
    }, [grouppicked.groupId])

    const handlegroupreplymessage = useCallback((global_Id: string,message:string) => {
        setreplyglobalid(global_Id)
        setoriginal_message(message)
        seteditmessage("")
        seteditglobalId("")
    }, [setreplyglobalid])
    function handlegroupreactmessage(global_Id:string,originalmessage:string,emoji:string){
        set("request:replymessage:group",{token:token,globalId:global_Id,message:emoji,groupId:grouppicked.groupId,replymessage:originalmessage})
    }
    function handlegroupmessagedeleteforeveryone(groupId:string,global_Id:string){
        set("request:messagestatuschange:group",{token:token,messageId:global_Id,groupId:groupId,status:"deleted"})
    }
    function handlegroupmessagedeleteforme(globalId:string,groupId:string){
        set("request:messagestatuschange:group",{token:token,messageId:globalId,groupId:groupId,status:"deleteforme"})
    }
    function handlegroupeditmessage(globalId:string){
        seteditglobalId(globalId)
        setreplyglobalid("")
        setoriginal_message("")
    }
    return (
        <ScrollArea className="w-full h-[74%] flex flex-col items-center bg-[#0a0a0a]">
            <div ref={containerRef} className="w-full flex flex-col px-3 sm:px-6 py-4">

                {isLoading && (
                    <div className="w-full flex items-center justify-center py-3 gap-2">
                        <Spinner />
                        <span className="text-xs text-white/40">Loading messages…</span>
                    </div>
                )}

                {conversations.length === 0 && !isLoading && (
                    <div className="flex-1 flex flex-col items-center justify-center text-white/20 gap-2 py-20">
                        <p className="text-sm">No messages yet</p>
                        <p className="text-xs text-white/15">Be the first to say something</p>
                    </div>
                )}

                {conversations.map((data, index) => {
                    const isMine = data.sendBy === usercurrentid
                    const isRemoved = data.status === "deleted" || data.status === "deleteforme"
                    return (
                        <div
                            key={data.globalId}
                            id={`message-${data.globalId}`}
                            data-id={data.globalId}
                            sender-id={data.sendBy}
                            mongo-id={data._id}
                            className={`group flex w-full mb-2 ${isMine ? "justify-end" : "justify-start"}`}
                        >
                            <div className={`flex flex-col max-w-[78%] sm:max-w-[60%] ${isMine ? "items-end" : "items-start"}`}>
                                {!isMine && (
                                    <span className="text-[11px] text-indigo-400/80 font-medium mb-0.5 px-1">{String(data.sendBy)}</span>
                                )}
                                {data.replyTo && (
                                    <div className={`mb-1 px-2.5 py-1.5 rounded-lg text-xs border-l-2 ${isMine ? "border-indigo-300 bg-indigo-500/10 text-indigo-200/70" : "border-white/20 bg-white/[0.04] text-white/40"} max-w-full truncate`}>
                                        {data.replyTo.message}
                                    </div>
                                )}
                                {!isRemoved && data.attachment && (
                                    data.attachment.type === "jpg" ? (
                                        <a href={data.attachment.url} target="_blank" rel="noopener noreferrer" className="block mb-1 max-w-[240px] rounded-xl overflow-hidden border border-white/10">
                                            <img src={data.attachment.url} alt={data.attachment.name} className="w-full h-auto object-cover" />
                                        </a>
                                    ) : (
                                        <a
                                            href={data.attachment.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`flex items-center gap-2.5 mb-1 px-3 py-2.5 rounded-xl border max-w-[240px] transition-colors ${isMine ? "bg-indigo-500/10 border-indigo-400/20 hover:bg-indigo-500/20" : "bg-white/[0.05] border-white/10 hover:bg-white/[0.08]"}`}
                                        >
                                            <FileText size={18} className="text-red-400 flex-shrink-0" />
                                            <span className="text-xs text-white/80 truncate flex-1">{data.attachment.name}</span>
                                            <Download size={13} className="text-white/40 flex-shrink-0" />
                                        </a>
                                    )
                                )}
                                {(data.message || isRemoved) && (
                                    <div
                                        className={`relative px-3.5 py-2 rounded-2xl text-sm leading-relaxed break-words ${
                                            isRemoved
                                                ? "bg-white/[0.03] text-white/25 italic border border-white/[0.06]"
                                                : isMine
                                                    ? "bg-indigo-500 text-white rounded-br-md"
                                                    : "bg-white/[0.07] text-white/90 rounded-bl-md"
                                        }`}
                                    >
                                        {data.status === "deleteforme" ? "Message deleted for you" : data.status === "deleted" ? "This message was deleted" : data.message}
                                    </div>
                                )}

                                <div className={`flex items-center gap-1.5 mt-1 px-1 ${isMine ? "flex-row-reverse" : "flex-row"}`}>
                                    <span className="text-[10px] text-white/25">
                                        {new Date(data.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                    {isMine && geticon(data.status)}

                                    {!isRemoved && (
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <button className="opacity-0 group-hover:opacity-100 h-5 w-5 rounded-md hover:bg-white/10 flex items-center justify-center text-white/30 hover:text-white/70 transition-all">
                                                    <MoreVertical size={11} />
                                                </button>
                                            </PopoverTrigger>

                                            <PopoverContent className="p-1.5 w-[210px] bg-[#1a1a1a] border-white/10">
                                                <div className="flex items-center justify-between px-1 pb-1.5 mb-1 border-b border-white/[0.06]">
                                                    {["👍", "❤️", "😂", "😮", "😢", "🙏"].map(emoji => (
                                                        <button
                                                            key={emoji}
                                                            className="h-7 w-7 flex items-center justify-center rounded-md hover:bg-white/10 text-base transition-colors"
                                                            onClick={() => handlegroupreactmessage(data.globalId, data.message, emoji)}
                                                        >
                                                            {emoji}
                                                        </button>
                                                    ))}
                                                </div>
                                                <div className="flex flex-col">
                                                    <button
                                                        className="flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs text-white/70 hover:bg-white/[0.06] hover:text-white transition-colors text-left"
                                                        onClick={() => handlegroupreplymessage(data.globalId, data.message)}
                                                    >
                                                        <Reply size={12} /> Reply
                                                    </button>

                                                    {isMine && (
                                                        <button
                                                            className="flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs text-white/70 hover:bg-white/[0.06] hover:text-white transition-colors text-left"
                                                            onClick={(e) => { e.stopPropagation(); handlegroupeditmessage(data.globalId) }}
                                                        >
                                                            <Edit size={12} /> Edit
                                                        </button>
                                                    )}

                                                    <button
                                                        className="flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs text-white/70 hover:bg-white/[0.06] hover:text-white transition-colors text-left"
                                                        onClick={(e) => { e.stopPropagation(); handlegroupmessagedeleteforme(data.globalId, data.groupId) }}
                                                    >
                                                        <Trash2 size={12} /> Delete for me
                                                    </button>

                                                    {isMine && (
                                                        <button
                                                            className="flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs text-red-400 hover:bg-red-500/10 transition-colors text-left"
                                                            onClick={(e) => { e.stopPropagation(); handlegroupmessagedeleteforeveryone(data.groupId, data.globalId) }}
                                                        >
                                                            <Trash size={12} /> Delete for everyone
                                                        </button>
                                                    )}
                                                </div>
                                            </PopoverContent>
                                        </Popover>
                                    )}
                                </div>
                            </div>
                        </div>
                    )
                })}

            </div>
        </ScrollArea>
    )
}
