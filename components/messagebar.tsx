"use client"
import React, { useRef, useState } from "react"
import { Button } from "./ui/button"
import { InputGroup } from "./ui/input-group"
import { InputGroupInput } from "./ui/input-group"
import { InputGroupAddon } from "./ui/input-group"
import { InputGroupButton } from "./ui/input-group"
import { Paperclip, Send, Mic, AudioLines, X, Pencil, Loader2 } from "lucide-react"
import { Onetooneconversationdetails } from "./store"
import { Toklue } from "./store"
import { Replytomessage } from "./store"
import { Editmessage } from "./store"
import { set } from "@/socketserver/clientsidesocket"
import Usespeechtotext from "./usespeechtotext"
import Uploadattachment from "@/actions/uploadattachment"
import toast from "react-hot-toast"

export default function Messagebar() {
    const onetooneconversationdetailsmessage = Onetooneconversationdetails(s => s.message)
    const setonetooneconversationdetailsmessage = Onetooneconversationdetails(s => s.setsendmessage)
    const toklue = Toklue(s => s.name)
    const onetooneconversationdetails = Onetooneconversationdetails(s => s.onetooneconversationdetails)
    const replytomessageglobal_id = Replytomessage(s => s.global_id)
    const replytomessagemessage = Replytomessage(s => s.message)
    const editglobal_id = Editmessage(s => s.global_id)
    const editmessage = Editmessage(s => s.message)
    const setcleaneditvalue = Editmessage(s => s.setcleanvalue)
    const setcleanreplyvalue = Replytomessage(s => s.setcleanvalue)
    const fileinputref = useRef<HTMLInputElement | null>(null)
    const [isuploading, setisuploading] = useState(false)

    function handleonetooneconversationdetailsmessage(value: string) {
        setonetooneconversationdetailsmessage(value)
        set("message:typing:onetooneconversation", { token: toklue, senderId: onetooneconversationdetails.senderId._id, recieverId: onetooneconversationdetails.recieverId._id, typing: true })
        setTimeout(() => {
            set("message:typing:onetooneconversation", { senderId: onetooneconversationdetails.senderId._id, recieverId: onetooneconversationdetails.recieverId._id, token: toklue, typing: false })
        }, 1500)
    }

    function handleonetooneconversationdetailssendmessage() {
        if (!onetooneconversationdetailsmessage.trim()) return
        if (!editglobal_id && !editmessage) {
            set("message:sent:onetooneconversation", { token: toklue, senderId: onetooneconversationdetails.senderId._id, recieverId: onetooneconversationdetails.recieverId._id, message: onetooneconversationdetailsmessage, createdAt: new Date(), status: "pending", replyto: { message: replytomessagemessage, global_id: replytomessageglobal_id } })
        }
        else if (editglobal_id && editmessage) {
            set("message:sent:edit:onetooneconversation", { senderId: onetooneconversationdetails.senderId._id, recieverId: onetooneconversationdetails.recieverId._id, global_id: editglobal_id, message: onetooneconversationdetailsmessage, token: toklue })
        }
        setcleaneditvalue()
        setcleanreplyvalue()
        setonetooneconversationdetailsmessage("")
    }

    function handlekeydown(e: React.KeyboardEvent) {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleonetooneconversationdetailssendmessage()
        }
    }

    async function handleattachmentselect(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (!file) return

        const isvalidtype = file.type === "application/pdf" || file.type === "image/jpeg" || file.type === "image/jpg"
        if (!isvalidtype) {
            toast.error("Only PDF and JPG files are supported")
            e.target.value = ""
            return
        }
        if (file.size > 8 * 1024 * 1024) {
            toast.error("File must be under 8MB")
            e.target.value = ""
            return
        }

        setisuploading(true)
        const formdata = new FormData()
        formdata.append("file", file)
        const response = await Uploadattachment(formdata)
        setisuploading(false)
        e.target.value = ""

        if (response === "Error") {
            toast.error("Upload failed, please try again")
            return
        }

        set("message:sent:onetooneconversation", {
            token: toklue,
            senderId: onetooneconversationdetails.senderId._id,
            recieverId: onetooneconversationdetails.recieverId._id,
            message: "",
            createdAt: new Date(),
            status: "pending",
            replyto: { message: replytomessagemessage, global_id: replytomessageglobal_id },
            attachment: response
        })
        setcleaneditvalue()
    }

    const speech = Usespeechtotext((finalchunk) => {
        const next = onetooneconversationdetailsmessage ? `${onetooneconversationdetailsmessage} ${finalchunk}` : finalchunk
        handleonetooneconversationdetailsmessage(next)
    })

    return (
        <div className="relative w-full min-w-0 px-3 sm:px-6 py-3 bg-[#111111] border-t border-white/[0.06]">
            {(replytomessagemessage && replytomessageglobal_id) && (
                <div className="flex items-center gap-2 mb-2 px-3 py-1.5 rounded-lg bg-white/[0.05] border-l-2 border-indigo-400">
                    <div className="flex-1 min-w-0">
                        <p className="text-[10px] text-indigo-400 font-medium">Replying to</p>
                        <p className="text-xs text-white/60 truncate">{replytomessagemessage}</p>
                    </div>
                    <button
                        className="h-5 w-5 rounded-md hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white/70 transition-colors flex-shrink-0"
                        onClick={() => setcleanreplyvalue()}
                    >
                        <X size={12} />
                    </button>
                </div>
            )}
            {(editglobal_id && editmessage) && (
                <div className="flex items-center gap-2 mb-2 px-3 py-1.5 rounded-lg bg-amber-500/10 border-l-2 border-amber-400">
                    <Pencil size={12} className="text-amber-400 flex-shrink-0" />
                    <p className="text-xs text-amber-300/80">Editing message</p>
                </div>
            )}

            <div className="flex min-w-0 items-center gap-2">
                <input
                    ref={fileinputref}
                    type="file"
                    accept=".pdf,.jpg,.jpeg,application/pdf,image/jpeg"
                    className="hidden"
                    onChange={handleattachmentselect}
                />
                <Button
                    variant="outline"
                    type="button"
                    disabled={isuploading}
                    className="h-9 w-9 p-0 flex-shrink-0 border-white/10 bg-white/[0.05] text-white/50 hover:text-white hover:bg-white/10"
                    onClick={(e) => { e.stopPropagation(); fileinputref.current?.click() }}
                >
                    {isuploading ? <Loader2 size={15} className="animate-spin" /> : <Paperclip size={15} />}
                </Button>

                <InputGroup className="flex-1 min-w-0">
                    <InputGroupInput
                        value={onetooneconversationdetailsmessage}
                        placeholder="Type a message…"
                        onChange={(e) => { e.stopPropagation(); handleonetooneconversationdetailsmessage(e.target.value) }}
                        onKeyDown={handlekeydown}
                        className="bg-white/[0.05] border-white/10 text-white placeholder:text-white/30 h-9 rounded-full px-4"
                    />
                    <InputGroupAddon align="inline-end">
                        <InputGroupButton
                            variant="outline"
                            size="icon-sm"
                            className="rounded-full bg-indigo-500 border-indigo-500 hover:bg-indigo-600 hover:border-indigo-600 text-white h-7 w-7"
                            onClick={(e) => { e.stopPropagation(); handleonetooneconversationdetailssendmessage() }}
                        >
                            <Send size={12} className="text-white" />
                        </InputGroupButton>
                    </InputGroupAddon>
                </InputGroup>

                <Button
                    variant="outline"
                    type="button"
                    className={`h-9 w-9 p-0 flex-shrink-0 rounded-full border-white/10 transition-colors ${speech.islistening ? "bg-red-500/20 border-red-500/40 text-red-400 animate-pulse" : "bg-white/[0.05] text-white/50 hover:text-white hover:bg-white/10"}`}
                    onClick={(e) => { e.stopPropagation(); speech.toggle() }}
                >
                    <Mic size={15} />
                </Button>
                <Button variant="outline" className="hidden sm:flex h-9 w-9 p-0 flex-shrink-0 border-white/10 bg-white/[0.05] text-red-400/70 hover:text-red-400 hover:bg-white/10">
                    <AudioLines size={15} />
                </Button>
            </div>
        </div>
    )
}
