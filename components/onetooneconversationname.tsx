"use client"
import { UsercurrentId } from "./store"
import { Currentselecteduserconversationname } from "./store"
import { Onetooneconversationdetails } from "./store"
import { Typingindicator } from "./store"
import { Onlinestatusmap } from "./store"

export default function Onetooneonconversationname() {
    const id = UsercurrentId(s => s.name)
    const name = Currentselecteduserconversationname(s => s.name)
    const onetooneconversationdetails = Onetooneconversationdetails(s => s.onetooneconversationdetails)
    const typingid = Typingindicator(s => s.id)
    const typingstatus = Typingindicator(s => s.typing)
    const statuses = Onlinestatusmap(s => s.statuses)

    function istyping() {
        return Boolean(typingid && typingstatus)
    }

    function getpartnerid() {
        const sender = onetooneconversationdetails.senderId._id
        const reciever = onetooneconversationdetails.recieverId._id
        return sender === id ? reciever : sender
    }

    function getstatus() {
        const partnerid = getpartnerid()
        const entry = partnerid ? statuses[partnerid] : undefined
        if (!entry) return ""
        if (entry.online) {
            return "Online"
        } else {
            const day = entry.seenon.toLocaleString("en-US", { weekday: "short" })
            const time = entry.seenon.toLocaleString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })
            return `last seen ${day}, ${time}`
        }
    }

    const status = getstatus()
    const isOnline = status === "Online"

    return (
        <div className="flex flex-col items-start min-w-0 flex-1">
            <span className="text-sm font-semibold text-white truncate w-full">{name}</span>
            <span className="text-xs text-white/40 flex items-center gap-1.5 truncate w-full">
                {istyping() ? (
                    <span className="text-indigo-400">typing…</span>
                ) : (
                    <>
                        {isOnline && <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 flex-shrink-0" />}
                        <span className="truncate">{status || "Offline"}</span>
                    </>
                )}
            </span>
        </div>
    )
}

