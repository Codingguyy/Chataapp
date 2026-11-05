"use client"
import { Button } from "./ui/button"
import { MoreVertical, LogOut, Phone } from "lucide-react"
import { Toklue } from "./store"
import { Onetooneconversationdetails } from "./store"
import { set } from "@/socketserver/clientsidesocket"

export default function Onetooneconversationfunctions() {
    const toklue = Toklue(s => s.name)
    const onetooneconversationdetails = Onetooneconversationdetails(s => s.onetooneconversationdetails)

    function handleleaveconversation() {
        set("request:conversation:leave", { token: toklue, senderId: onetooneconversationdetails.senderId._id, recieverId: onetooneconversationdetails.recieverId._id })
    }

    return (
        <div className="flex items-center gap-1.5 ml-auto flex-shrink-0">
            <Button variant="outline" size="icon-sm" className="hidden sm:flex h-8 w-8 border-white/10 bg-white/[0.05] text-white/50 hover:text-white hover:bg-white/10">
                <Phone size={14} />
            </Button>
            <Button
                variant="outline"
                size="icon-sm"
                className="h-8 w-8 border-white/10 bg-white/[0.05] text-white/50 hover:text-red-400 hover:bg-red-500/10"
                onClick={(e) => { e.stopPropagation(); handleleaveconversation() }}
            >
                <LogOut size={14} />
            </Button>
            <Button variant="outline" size="icon-sm" className="h-8 w-8 border-white/10 bg-white/[0.05] text-white/50 hover:text-white hover:bg-white/10">
                <MoreVertical size={14} />
            </Button>
        </div>
    )
}
