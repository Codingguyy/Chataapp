"use client"
import React from "react";
import { useRef, useState } from "react";
import { Button } from "./ui/button";
import { InputGroup } from "./ui/input-group";
import { InputGroupInput } from "./ui/input-group";
import { InputGroupAddon } from "./ui/input-group";
import { InputGroupButton } from "./ui/input-group";
import { Paperclip, Send, Mic, AudioLines, X, Pencil, Loader2 } from "lucide-react";
import { Groupmessagebar } from "./store";
import { Grouppicked } from "./store";
import { Toklue } from "./store";
import { Groupreplymessage } from "./store";
import { Editmessage } from "./store";
import { set } from "@/socketserver/clientsidesocket";
import toast from "react-hot-toast";
import Usespeechtotext from "./usespeechtotext";
import Uploadattachment from "@/actions/uploadattachment";

export default function Groupmessagesbar() {
  const message = Groupmessagebar(s => s.name)
  const setmessage = Groupmessagebar(s => s.setname)
  const group = Grouppicked(s => s.group)
  const token = Toklue(s => s.name)
  const replyglobalId = Groupreplymessage(s => s.global_id)
  const replymessage = Groupreplymessage(s => s.message)
  const setreplyglobalId = Groupreplymessage(s => s.setglobal_id)
  const setreplymessage = Groupreplymessage(s => s.setmessage)
  const original_message = Groupreplymessage(s => s.original_message)
  const setoriginal_message = Groupreplymessage(s => s.setoriginal_message)
  const editglobalId = Editmessage(s => s.global_id)
  const editmessage = Editmessage(s => s.message)
  const seteditglobalId = Editmessage(s => s.setglobal_id)
  const seteditmessage = Editmessage(s => s.setmessage)
  const fileinputref = useRef<HTMLInputElement | null>(null)
  const [isuploading, setisuploading] = useState(false)

  function handlesendmessage() {
    if (!message.trim()) return
    set("request:sendmessage:group", { token: token, groupId: group.groupId, message: message, reply: false })
    setmessage("")
  }
  function handlegrouptyping() {
    set("request:grouptypingonlinetyping:group", { token: token, groupId: group.groupId, status: true })
    setTimeout(() => {
      set("request:grouptypingonlinetyping:group", { token: token, groupId: group.groupId, status: false })
    }, 1500)
  }
  function handlegroupreplymessage() {
    if (replyglobalId && original_message && message.trim()) {
      set("request:replymessage:group", { token: token, globalId: replyglobalId, message: message, groupId: group.groupId, replymessage: original_message })
      setreplyglobalId("")
      setreplymessage("")
      setoriginal_message("")
      seteditglobalId("")
      seteditmessage("")
      setmessage("")
    } else {
      toast.error("First select a message")
    }
  }
  function handlesendeditmessage() {
    if (editglobalId && message) {
      set("request:editmessage:group", { groupId: group.groupId, message: message, globalId: editglobalId, token: token })
      seteditglobalId("")
      seteditmessage("")
      setmessage("")
    }
  }
  function handlecancelreply() {
    setreplyglobalId("")
    setreplymessage("")
    setoriginal_message("")
  }
  function handlesend() {
    if (replyglobalId) handlegroupreplymessage()
    else if (editglobalId) handlesendeditmessage()
    else handlesendmessage()
    handlegrouptyping()
  }
  function handlekeydown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handlesend()
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

    set("request:sendmessage:group", { token: token, groupId: group.groupId, message: "", reply: false, attachment: response })
  }

  const speech = Usespeechtotext((finalchunk) => {
    setmessage(message ? `${message} ${finalchunk}` : finalchunk)
  })

  return (
    <div className="relative w-full min-w-0 px-3 sm:px-6 py-3 bg-[#111111] border-t border-white/[0.06]">
      {(original_message && replyglobalId) && (
        <div className="flex items-center gap-2 mb-2 px-3 py-1.5 rounded-lg bg-white/[0.05] border-l-2 border-indigo-400">
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-indigo-400 font-medium">Replying to</p>
            <p className="text-xs text-white/60 truncate">{original_message}</p>
          </div>
          <button
            className="h-5 w-5 rounded-md hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white/70 transition-colors flex-shrink-0"
            onClick={() => handlecancelreply()}
          >
            <X size={12} />
          </button>
        </div>
      )}
      {(editglobalId) && (
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
            value={message}
            placeholder="Type a message…"
            onChange={(e) => { e.stopPropagation(); setmessage(e.target.value) }}
            onKeyDown={handlekeydown}
            className="bg-white/[0.05] border-white/10 text-white placeholder:text-white/30 h-9 rounded-full px-4"
          />
          <InputGroupAddon align="inline-end">
            <InputGroupButton
              variant="outline"
              size="icon-sm"
              className={`rounded-full h-7 w-7 ${replyglobalId ? "bg-amber-500 border-amber-500 hover:bg-amber-600" : "bg-indigo-500 border-indigo-500 hover:bg-indigo-600"} hover:border-indigo-600 text-white`}
              onClick={(e) => { e.stopPropagation(); handlesend() }}
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
