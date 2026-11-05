"use client"
import { FieldLabel } from "./ui/field"
import { InputGroup } from "./ui/input-group"
import { InputGroupInput } from "./ui/input-group"
import { InputGroupButton } from "./ui/input-group"
import { InputGroupAddon } from "./ui/input-group"
import { Switch } from "./ui/switch"
import { Separator } from "./ui/separator"
import { ScrollArea } from "./ui/scroll-area"
import { Badge } from "./ui/badge"
import { Popover } from "./ui/popover"
import { PopoverTrigger } from "./ui/popover"
import { PopoverContent } from "./ui/popover"
import { Button } from "./ui/button"
import { Pencil, Users, Settings as SettingsIcon, ChevronDown, ShieldBan, ShieldCheck } from "lucide-react"
import { Grouptypingonline } from "./store"
import { Grouppicked } from "./store"
import { Toklue } from "./store"
import { Editmessage } from "./store"
import { UsercurrentId } from "./store"
import { promote } from "@/types/groupconversations"
import { groupsettings } from "@/types/groupconversations"
import { set } from "@/socketserver/clientsidesocket"

export default function Groupsettings() {
  const groupmemberlist = Grouptypingonline(s => s.list)
  const group = Grouppicked(s => s.group)
  const token = Toklue(s => s.name)
  const groupname = Editmessage(s => s.message)
  const setgroupname = Editmessage(s => s.setmessage)
  const groupdescription = Editmessage(s => s.global_id)
  const setgroupdescription = Editmessage(s => s.setglobal_id)
  const usercurrentid = UsercurrentId(s => s.name)
  const isAdmin = group.admins.includes(usercurrentid)

  function findonline(id: string) {
    return groupmemberlist.find(data => data.id === id)?.online
  }
  function findtyping(id: string) {
    return groupmemberlist.find(data => data.id === id)?.typing
  }
  function handlememberchangestatus(id: string, status: promote) {
    set("request:memberstatus:group", { memberId: id, status: status, groupId: group.groupId, token: token })
  }
  function handleeditgroupname() {
    if (groupname) set("request:groupname:group", { token: token, groupId: group.groupId, name: groupname })
  }
  function handlechangegroupsettings(value: groupsettings, valuee: boolean) {
    set("request:groupsettings:group", { token: token, groupId: group.groupId, Settings: value, value: valuee })
  }
  function handleblockmember(memberId: string, action: "block" | "unblock") {
    set("request:block:group", { token: token, groupId: group.groupId, memberId: memberId, action: action })
  }
  function handlekickmember(memberId: string) {
    set("request:kickmember:group", { token: token, groupId: group.groupId, memberId: memberId })
  }

  return (
    <div className="h-full w-full flex flex-col bg-[#0a0a0a] overflow-y-auto">
      <div className="px-6 py-5 border-b border-white/[0.06] flex items-center gap-2">
        <SettingsIcon size={16} className="text-indigo-400" />
        <span className="text-lg font-semibold text-white">Group settings</span>
      </div>

      <div className="px-6 py-5 space-y-5 border-b border-white/[0.06]">
        <div>
          <FieldLabel htmlFor="Name" className="text-white/50 text-xs mb-1.5">Group name</FieldLabel>
          <InputGroup className="w-full">
            <InputGroupInput
              value={groupname}
              placeholder="Edit the name"
              onChange={(e) => { e.stopPropagation(); setgroupname(e.target.value) }}
              className="bg-white/[0.05] border-white/10 text-white placeholder:text-white/30"
            />
            <InputGroupAddon align="inline-start"><Pencil size={13} className="text-white/40" /></InputGroupAddon>
            <InputGroupAddon align="inline-end">
              <InputGroupButton
                variant="outline"
                disabled={!isAdmin}
                className="text-xs border-white/10 bg-white/[0.05] text-white/70 hover:text-white hover:bg-white/10"
                onClick={(e) => { e.stopPropagation(); handleeditgroupname() }}
              >
                Save
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </div>

        <div>
          <FieldLabel htmlFor="Description" className="text-white/50 text-xs mb-1.5">Group description</FieldLabel>
          <InputGroup className="w-full">
            <InputGroupInput
              value={groupdescription}
              placeholder="Edit the description"
              onChange={(e) => { e.stopPropagation(); setgroupdescription(e.target.value) }}
              className="bg-white/[0.05] border-white/10 text-white placeholder:text-white/30"
            />
            <InputGroupAddon align="inline-start"><Pencil size={13} className="text-white/40" /></InputGroupAddon>
            <InputGroupAddon align="inline-end">
              <InputGroupButton
                variant="outline"
                disabled={!isAdmin}
                className="text-xs border-white/10 bg-white/[0.05] text-white/70 hover:text-white hover:bg-white/10"
                onClick={(e) => { e.stopPropagation() }}
              >
                Save
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </div>

        {isAdmin && (
          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between">
              <FieldLabel htmlFor="OnlyAdminMsg" className="text-white/70 text-sm">Only admins can send messages</FieldLabel>
              <Switch
                onCheckedChange={(e) => { handlechangegroupsettings("OnlyAdminCanEditMessage", e) }}
                className="data-[state=checked]:bg-indigo-500 data-[state=unchecked]:bg-white/10"
              />
            </div>
            <div className="flex items-center justify-between">
              <FieldLabel htmlFor="OnlyAdminInfo" className="text-white/70 text-sm">Only admins can edit group info</FieldLabel>
              <Switch
                onCheckedChange={(e) => { handlechangegroupsettings("OnlyAdminCanEditInfo", e) }}
                className="data-[state=checked]:bg-indigo-500 data-[state=unchecked]:bg-white/10"
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col px-6 py-5 space-y-3">
        <div className="flex items-center gap-2">
          <Users size={14} className="text-white/40" />
          <span className="text-sm font-medium text-white/70">Members ({group.members?.length ?? 0})</span>
        </div>
        <ScrollArea className="flex-1">
          <div className="space-y-2 pr-2">
            {group.members?.map((data, i) => (
              <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.06]">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{data.name}</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-0 bg-white/10 text-white/50">
                      {group.admins.includes(data.id) ? "admin" : "member"}
                    </Badge>
                    {group.blocked?.includes(data.id) && (
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-0 bg-red-500/15 text-red-400">
                        blocked
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-1 items-end flex-shrink-0">
                  <Badge variant="outline" className={`text-[10px] px-1.5 py-0 border-0 ${findonline(data.id) ? "bg-emerald-500/15 text-emerald-400" : "bg-white/10 text-white/40"}`}>
                    {findonline(data.id) ? "Online" : "Offline"}
                  </Badge>
                  <Badge variant="outline" className={`text-[10px] px-1.5 py-0 border-0 ${findtyping(data.id) ? "bg-indigo-500/15 text-indigo-400" : "bg-white/10 text-white/30"}`}>
                    {findtyping(data.id) ? "Typing" : "Idle"}
                  </Badge>
                </div>
                {isAdmin && (
                  <Popover>
                    <PopoverTrigger asChild>
                      <button className="h-7 w-7 rounded-md bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors flex-shrink-0">
                        <ChevronDown size={13} />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="bg-[#1a1a1a] border-white/10 text-white w-[160px] space-y-1">
                      <button
                        className="w-full text-left text-xs text-white/70 hover:text-white px-2 py-1.5 rounded-md hover:bg-white/[0.06] transition-colors"
                        onClick={(e) => { e.stopPropagation(); handlememberchangestatus(data.id, "admin") }}
                      >
                        Make admin
                      </button>
                      <button
                        className="w-full text-left text-xs text-white/70 hover:text-white px-2 py-1.5 rounded-md hover:bg-white/[0.06] transition-colors"
                        onClick={(e) => { e.stopPropagation(); handlememberchangestatus(data.id, "member") }}
                      >
                        Make member
                      </button>
                      <Separator className="bg-white/10 my-1" />
                      {group.blocked?.includes(data.id) ? (
                        <button
                          className="w-full flex items-center gap-2 text-left text-xs text-emerald-400 hover:text-emerald-300 px-2 py-1.5 rounded-md hover:bg-emerald-500/10 transition-colors"
                          onClick={(e) => { e.stopPropagation(); handleblockmember(data.id, "unblock") }}
                        >
                          <ShieldCheck size={12} /> Unblock member
                        </button>
                      ) : (
                        <button
                          className="w-full flex items-center gap-2 text-left text-xs text-red-400 hover:text-red-300 px-2 py-1.5 rounded-md hover:bg-red-500/10 transition-colors"
                          onClick={(e) => { e.stopPropagation(); handleblockmember(data.id, "block") }}
                        >
                          <ShieldBan size={12} /> Block member
                        </button>
                      )}
                      {group.createdBy !== data.id && (
                        <button
                          className="w-full text-left text-xs text-red-400 hover:text-red-300 px-2 py-1.5 rounded-md hover:bg-red-500/10 transition-colors"
                          onClick={(e) => { e.stopPropagation(); handlekickmember(data.id) }}
                        >
                          Kick member
                        </button>
                      )}
                    </PopoverContent>
                  </Popover>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
