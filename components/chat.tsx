"use client"
import { useRef } from "react"
import { useEffect } from "react"
import { useParams } from "next/navigation"
import Searchuserexistuser from "./searchuserexistuser"
import { set } from "@/socketserver/clientsidesocket"
import { InputGroup } from "@/components/ui/input-group"
import { InputGroupInput } from "@/components/ui/input-group"
import { InputGroupAddon } from "@/components/ui/input-group"
import { InputGroupButton } from "@/components/ui/input-group"
import { Separator } from "./ui/separator"
import { Switch } from "./ui/switch"
import { Searchname } from "./store"
import { Toklue } from "./store"
import { Searchvalue } from "./store"
import { Searchloading } from "./store"
import { Onetooneconversationsendrequest } from "./store"
import { Userexistlistt } from "./store"
import { Switchvalue } from "./store"
import { Search } from "lucide-react"
import { onetoonerequest } from "@/types/request"

export default function Chatdashboard() {
  const params = useParams()
  const timeoutref = useRef<ReturnType<typeof setTimeout> | null>(null)
  const name = Searchname(s => s.name)
  const setname = Searchname(s => s.setname)
  const token = Toklue(s => s.name)
  const chatid = params.id
  const setonetooneconversationsendrequest = Onetooneconversationsendrequest(s => s.setrequests)
  const searchvalue = Searchvalue(s => s.value)
  const setsearchvalue = Searchvalue(s => s.setvlue)
  const setsearchloading = Searchloading(s => s.setvlue)
  const userexistlist = Userexistlistt(s => s.users)
  const switchvalue = Switchvalue(s => s.value)
  const setswitchvalue = Switchvalue(s => s.setvlue)

  function handlename(value: string) {
    setname(value)
    if (timeoutref.current) clearTimeout(timeoutref.current)
    if (value.trim().length > 0) {
      setsearchvalue(true)
      setsearchloading(true)
      timeoutref.current = setTimeout(() => { handlesearch() }, 3000)
    } else {
      setsearchvalue(false)
      setsearchloading(false)
    }
  }

  function handlesearch() {
    setsearchloading(true)
    if (switchvalue) {
      set("request:groups:search", { token: token, search: name })
    } else {
      set("search:request", { token: token, search: name })
    }
  }

  useEffect(() => {
    set("request:existusers", { token: token })
  }, [userexistlist])

  return (
    <div className={`h-[calc(100vh-3.5rem)] z-10 ${chatid ? "hidden" : "flex"} md:flex flex-col w-full sm:w-[32%] bg-[#111111] border-r border-white/[0.06]`}>

      
      <div className="px-4 pt-4 pb-3 space-y-3">
        <div className="relative">
          <InputGroup className="w-full">
            <InputGroupInput
              value={name}
              placeholder={switchvalue ? "Search groups…" : "Search people…"}
              onChange={(e) => { e.stopPropagation(); handlename(e.target.value) }}
              className="bg-white/[0.05] border-white/10 text-white placeholder:text-white/30 focus:border-indigo-500/50 focus:bg-white/[0.07] rounded-lg pr-20 pl-9 h-9 text-sm"
            />
            <InputGroupAddon align={"inline-start"}>
              <Search size={14} className="text-white/30" />
            </InputGroupAddon>
            <InputGroupAddon align={"inline-end"}>
              <InputGroupButton
                variant={"outline"}
                className="hidden sm:flex h-7 text-xs border-white/10 bg-white/[0.05] text-white/60 hover:text-white hover:bg-white/10 hover:border-white/20 rounded-md"
                onClick={(e) => { e.stopPropagation(); handlesearch() }}
              >
                Search
              </InputGroupButton>
              <InputGroupButton
                variant={"outline"}
                className="sm:hidden h-7 w-7 border-white/10 bg-white/[0.05] text-white/60 hover:text-white rounded-md p-0"
              >
                <Search size={13} />
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </div>

        
        <div className="flex items-center gap-2 px-1">
          <span className={`text-xs font-medium transition-colors ${!switchvalue ? "text-white" : "text-white/30"}`}>
            People
          </span>
          <Switch
            checked={switchvalue}
            onCheckedChange={(value) => { setswitchvalue(value) }}
            className="data-[state=checked]:bg-indigo-500 data-[state=unchecked]:bg-white/10"
          />
          <span className={`text-xs font-medium transition-colors ${switchvalue ? "text-white" : "text-white/30"}`}>
            Groups
          </span>
        </div>
      </div>

      <Separator className="bg-white/[0.06]" />

      
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        <Searchuserexistuser />
      </div>
    </div>
  )
}
