"use client"
import { useEffect, useRef, useState } from "react"
import { messagestatus } from "@/types/1to1conversations"
import { set } from "@/socketserver/clientsidesocket"
import { ScrollArea } from "./ui/scroll-area"
import { Spinner } from "./ui/spinner"
import { Popover, PopoverTrigger, PopoverContent } from "./ui/popover"
import { Button } from "./ui/button"
import { Field } from "./ui/field"
import { FieldLabel } from "./ui/field"
import { Input } from "./ui/input"
import { Toklue } from "./store"
import { Onetooneconversationdetails } from "./store"
import { Conversationpagination } from "./store"
import { UsercurrentId } from "./store"
import { Replytomessage } from "./store"
import { Editmessage } from "./store"
import { Clock, CheckCheck, Trash2, MoreVertical, Trash, Reply, Edit, Check, FileText, Download } from "lucide-react"

export default function Messagesarea() {
    const intersectionobserverref = useRef<IntersectionObserver | null>(null)
    const loadmoreref = useRef<ReturnType<typeof setTimeout> | null>(null)

   
    const [isLoading, setIsLoading] = useState(false)

    const toklue = Toklue(s => s.name)
    const onetooneconversationdetails = Onetooneconversationdetails(s => s.onetooneconversationdetails)
    const setonetooneconversationdetailsmessage = Onetooneconversationdetails(s => s.setsendmessage)
    const cursorid = Conversationpagination(s => s.cursor_id)
    const hasMore = Conversationpagination(s => s.hasMore)
    const hasmoreref = useRef(hasMore)
    const usercurrentid = UsercurrentId(s => s.name)
    const setreplytomessage = Replytomessage(s => s.setmessage)
    const setreplytoglobal_id = Replytomessage(s => s.setglobal_id)
    const seteditglobal_id = Editmessage(s => s.setglobal_id)
    const seteditmessage = Editmessage(s => s.setmessage)
    const editmessage = Editmessage(s => s.message)
   
    const toklueref = useRef(toklue)
    const usercurrentidref = useRef(usercurrentid)
    const onetooneconversationdetailsref = useRef(onetooneconversationdetails)
    const cursoridref = useRef(cursorid)
    const bottomref = useRef<HTMLDivElement | null>(null)

    useEffect(() => { toklueref.current = toklue }, [toklue])
    useEffect(() => { usercurrentidref.current = usercurrentid }, [usercurrentid])
    useEffect(() => { onetooneconversationdetailsref.current = onetooneconversationdetails }, [onetooneconversationdetails])
    useEffect(() => { cursoridref.current = cursorid }, [cursorid])
    useEffect(() => { hasmoreref.current = hasMore }, [hasMore])

   
    useEffect(() => {
        intersectionobserverref.current = new IntersectionObserver((values) => {
            values.forEach((value) => {
                const id = value.target.getAttribute('data-id')
                const senderId = value.target.getAttribute('sender-id')
                const index = value.target.getAttribute('data-index')

                if (value.isIntersecting) {
                    if (usercurrentidref.current !== senderId) {
                        set("message:view:onetooneconversation", {
                            senderId: onetooneconversationdetailsref.current?.senderId?._id,
                            recieverId: onetooneconversationdetailsref.current?.recieverId?._id,
                            global_id: id,
                            token: toklueref.current
                        })
                    }

                    intersectionobserverref.current?.unobserve(value.target)
                }

                if (index === "0" && value.isIntersecting) {
                    if (loadmoreref.current) {
                        clearTimeout(loadmoreref.current)
                    }

                    loadmoreref.current = setTimeout(() => {
                        handleloadmoreconversations()
                    }, 2000)
                }
            })
        }, { threshold: 0.6 })

        return () => intersectionobserverref.current?.disconnect()
    }, [])

    function handleloadmoreconversations() {
        if (hasmoreref.current !== false) {
            if (isLoading) return

            setIsLoading(true)

            set("message:loadmore:onetooneconversations", {
                senderId: onetooneconversationdetailsref.current?.senderId?._id,
                recieverId: onetooneconversationdetailsref.current?.recieverId?._id,
                token: toklueref.current,
                cursor_id: cursoridref.current
            })
        }
    }

    function handleonetooneconversationmessages(
        senderId: string,
        recieverId: string,
        status: messagestatus,
        message: string,
        messagesenderId: string,
        global_id: string
    ) {
        set("message:deleted:onetooneconversation", {
            senderId,
            recieverId,
            status: "deleted",
            message,
            messagesenderId,
            token: toklue,
            globalId: global_id
        })
    }

    function handleonetooneconversationdeleteforme(
        senderId: string,
        recieverId: string,
        messageId: string
    ) {
        set("message:deleteforme:onetooneconversation", {
            senderid: senderId,
            recieverId,
            messageid: messageId,
            userid: usercurrentid,
            status: "deleteforme",
            token: toklue
        })
    }

    function handlereplytomessage(global_id: string, message: string) {
        setreplytoglobal_id(global_id)
        setreplytomessage(message)
    }

    function handlereactmessage(global_id: string, originalmessage: string, emoji: string) {
        set("message:sent:onetooneconversation", {
            token: toklue,
            senderId: onetooneconversationdetails.senderId._id,
            recieverId: onetooneconversationdetails.recieverId._id,
            message: emoji,
            createdAt: new Date(),
            status: "pending",
            replyto: { message: originalmessage, global_id: global_id }
        })
    }

    function handleeditmessage(global_id: string) {
        set("message:sent:edit:onetooneconversation", { token: toklue, global_id: global_id, message: editmessage, senderId: usercurrentid, recieverId: onetooneconversationdetails.recieverId._id })
    }

    function geticon(value: messagestatus) {
        if (value === "deleted") return <Trash2 size={11} className="text-red-400" />
        if (value === "pending") return <Clock size={11} className="text-white/30" />
        if (value === "view") return <CheckCheck size={11} className="text-indigo-400" />
    }

    useEffect(() => {
        if (onetooneconversationdetails.conversations.length) {
            setIsLoading(false)
        }
    }, [onetooneconversationdetails.conversations])

    const observedidsref = useRef<Set<string>>(new Set())
    useEffect(() => {
        if (!intersectionobserverref.current) return
        if (!onetooneconversationdetails.conversations.length) return

        const elements = document.querySelectorAll('[data-id]')
        elements.forEach(el => {
            const id = el.getAttribute('data-id')
            if (id && !observedidsref.current.has(id)) {
                observedidsref.current.add(id)
                intersectionobserverref.current?.observe(el)
            }
        })
    }, [onetooneconversationdetails.conversations])

    return (
        <ScrollArea className="w-full h-[74%] flex flex-col items-center bg-[#0a0a0a]">
            <div className="w-full h-full flex-1 flex flex-col px-3 sm:px-6 py-4">

                {isLoading && (
                    <div className="w-full flex items-center justify-center py-3 gap-2">
                        <Spinner />
                        <span className="text-xs text-white/40">Loading messages…</span>
                    </div>
                )}

                {onetooneconversationdetails.conversations.length === 0 && !isLoading && (
                    <div className="flex-1 flex flex-col items-center justify-center text-white/20 gap-2 py-20">
                        <p className="text-sm">No messages yet</p>
                        <p className="text-xs text-white/15">Say hello to start the conversation</p>
                    </div>
                )}

                {onetooneconversationdetails.conversations.map((data, index) => {
                    const isMine = data.senderId === usercurrentid
                    const isRemoved = data.status === "deleteforme" || data.status === "deleted"
                    return (
                        <div
                            key={data.global_id}
                            data-id={data.global_id}
                            sender-id={data.senderId}
                            data-index={index}
                            className={`group flex w-full mb-2 ${isMine ? "justify-end" : "justify-start"}`}
                        >
                            <div className={`flex flex-col max-w-[78%] sm:max-w-[60%] ${isMine ? "items-end" : "items-start"}`}>
                                {data.replyto && (
                                    <div className={`mb-1 px-2.5 py-1.5 rounded-lg text-xs border-l-2 ${isMine ? "border-indigo-300 bg-indigo-500/10 text-indigo-200/70" : "border-white/20 bg-white/[0.04] text-white/40"} max-w-full truncate`}>
                                        {data.replyto.message}
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
                                                            onClick={() => handlereactmessage(data.global_id, data.message, emoji)}
                                                        >
                                                            {emoji}
                                                        </button>
                                                    ))}
                                                </div>
                                                <div className="flex flex-col">
                                                    <button
                                                        className="flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs text-white/70 hover:bg-white/[0.06] hover:text-white transition-colors text-left"
                                                        onClick={() => handlereplytomessage(data.global_id, data.message)}
                                                    >
                                                        <Reply size={12} /> Reply
                                                    </button>

                                                    {isMine && (
                                                        <Popover>
                                                            <PopoverTrigger asChild>
                                                                <button className="flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs text-white/70 hover:bg-white/[0.06] hover:text-white transition-colors text-left">
                                                                    <Edit size={12} /> Edit
                                                                </button>
                                                            </PopoverTrigger>
                                                            <PopoverContent className="bg-[#1a1a1a] border-white/10 w-[260px]">
                                                                <Field>
                                                                    <FieldLabel htmlFor="Message" className="text-white/50 text-xs mb-1.5">Edit message</FieldLabel>
                                                                    <Input
                                                                        id="Message"
                                                                        defaultValue={data.message}
                                                                        value={editmessage}
                                                                        onChange={(e) => { e.stopPropagation(); seteditmessage(e.target.value) }}
                                                                        className="bg-white/[0.05] border-white/10 text-white text-sm"
                                                                    />
                                                                </Field>
                                                                <Button
                                                                    variant="outline"
                                                                    className="w-full mt-2 text-xs bg-indigo-500 border-indigo-500 text-white hover:bg-indigo-600"
                                                                    onClick={(e) => { e.stopPropagation(); handleeditmessage(data.global_id) }}
                                                                >
                                                                    <Check size={12} className="mr-1.5" /> Save edit
                                                                </Button>
                                                            </PopoverContent>
                                                        </Popover>
                                                    )}

                                                    <button
                                                        className="flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs text-white/70 hover:bg-white/[0.06] hover:text-white transition-colors text-left"
                                                        onClick={() => handleonetooneconversationdeleteforme(
                                                            onetooneconversationdetails.senderId._id,
                                                            onetooneconversationdetails.recieverId._id,
                                                            data.global_id
                                                        )}
                                                    >
                                                        <Trash2 size={12} /> Delete for me
                                                    </button>

                                                    {isMine && (
                                                    <button
                                                        className="flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs text-red-400 hover:bg-red-500/10 transition-colors text-left"
                                                        onClick={() => handleonetooneconversationmessages(
                                                            onetooneconversationdetails.senderId._id,
                                                            onetooneconversationdetails.recieverId._id,
                                                            data.status,
                                                            data.message,
                                                            data.senderId,
                                                            data.global_id
                                                        )}
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
                <div ref={bottomref} />
            </div>
        </ScrollArea>
    )
}
