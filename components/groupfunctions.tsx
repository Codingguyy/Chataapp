"use client"
import { useEffect } from "react";
import { Button } from "./ui/button";
import { Popover } from "./ui/popover";
import { PopoverTrigger } from "./ui/popover";
import { PopoverContent } from "./ui/popover";
import { ScrollArea } from "./ui/scroll-area";
import { Users, LogOut, Settings, MessageSquare } from "lucide-react";
import { set } from "@/socketserver/clientsidesocket";
import { Grouppicked } from "./store";
import { Toklue } from "./store";
import { Groupsettings } from "./store";

export default function Groupfunctions() {
    const group = Grouppicked(s => s.group)
    const toklue = Toklue(s => s.name)
    const groupsettings = Groupsettings(s => s.value)
    const setgroupsettings = Groupsettings(s => s.setvlue)

    function handlegrouptypingonline(value: boolean) {
        set("request:grouptypingonline:group", { groupId: group.groupId, token: toklue })
    }
    function handlegroupsettings() {
        setgroupsettings(!groupsettings)
    }
    function handlegroupleave() {
        set("request:groupleave:group", { groupId: group.groupId, token: toklue })
    }

    useEffect(() => {
        handlegrouptypingonline(true)
        const interval = setInterval(() => { handlegrouptypingonline(true) }, 20000)
        return () => clearInterval(interval)
    }, [])

    return (
        <div className="flex items-center gap-1.5 ml-auto flex-shrink-0">
            <Button
                variant="outline"
                size="icon-sm"
                className="h-8 w-8 border-white/10 bg-white/[0.05] text-white/50 hover:text-red-400 hover:bg-red-500/10"
                onClick={(e) => { e.stopPropagation(); handlegroupleave() }}
            >
                <LogOut size={14} />
            </Button>
            <Button
                variant="outline"
                size="icon-sm"
                className={`h-8 w-8 border-white/10 ${groupsettings ? "bg-indigo-500/20 text-indigo-400" : "bg-white/[0.05] text-white/50"} hover:text-white hover:bg-white/10`}
                onClick={(e) => { e.stopPropagation(); handlegroupsettings() }}
            >
                {groupsettings ? <MessageSquare size={14} /> : <Settings size={14} />}
            </Button>
        </div>
    )
}
