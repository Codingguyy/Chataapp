"use client"
import { Grouppicked } from "./store"
import { UsercurrentId } from "./store"
import { Badge } from "./ui/badge"

export default function Groupname() {
    const group = Grouppicked(s => s.group)
    const usercurrentid = UsercurrentId(s => s.name)

    function getnames() {
        let parts: string[] = ["You"]
        const members = group.members
        for (let i = 0; i < members.length; i++) {
            if (i <= 4 && members[i].id !== usercurrentid) {
                parts.push(members[i].name)
            }
        }
        return parts.join(", ")
    }

    function checkstatus() {
        const admins = group.admins
        if (admins?.includes(usercurrentid)) {
            return <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-0 bg-emerald-500/15 text-emerald-400">admin</Badge>
        }
        return <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-0 bg-white/10 text-white/50">member</Badge>
    }

    return (
        <div className="flex flex-col items-start min-w-0 flex-1">
            <span className="text-sm font-semibold text-white flex items-center gap-2 truncate w-full">
                <span className="truncate">{group.name}</span>
                {checkstatus()}
            </span>
            <span className="text-xs text-white/40 truncate w-full">{getnames()}</span>
        </div>
    )
}
