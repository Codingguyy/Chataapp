"use client"
import { Dialog } from "./ui/dialog"
import { DialogTrigger } from "./ui/dialog"
import { DialogHeader } from "./ui/dialog"
import { DialogTitle } from "./ui/dialog"
import { DialogDescription } from "./ui/dialog"
import { DialogContent } from "./ui/dialog"
import { Field } from "./ui/field"
import { FieldLabel } from "./ui/field"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { Button } from "./ui/button"
import { UsersRound } from "lucide-react"
import { set } from "@/socketserver/clientsidesocket"
import { Creategroup } from "./store"
import { Toklue } from "./store"
import { Grouppicked } from "./store"

export default function Groupcreate() {
  const groupname = Creategroup(s => s.global_id)
  const groupdescription = Creategroup(s => s.message)
  const setgroupname = Creategroup(s => s.setglobal_id)
  const setgroupdescription = Creategroup(s => s.setmessage)
  const grouppicked = Grouppicked(s => s.group)
  const token = Toklue(s => s.name)

  function handlecreategroup() {
    set("request:creategroup", { token: token, name: groupname, description: groupdescription })
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-white/60 hover:text-white hover:bg-white/[0.06] text-xs font-medium transition-colors w-full sm:w-auto text-left">
          <UsersRound size={14} />
          <span>Create group</span>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[440px] bg-[#141414] border-white/10 text-white">
        <DialogHeader>
          <DialogTitle className="text-white">Create a group</DialogTitle>
          <DialogDescription className="text-white/40">Give your group a name and description</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-2">
          <Field>
            <FieldLabel htmlFor="Name" className="text-white/60 text-xs mb-1.5">Group name</FieldLabel>
            <Input
              value={groupname}
              placeholder="Enter group name…"
              className="bg-white/[0.05] border-white/10 text-white placeholder:text-white/30"
              onChange={(e) => { e.stopPropagation(); setgroupname(e.target.value) }}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="Description" className="text-white/60 text-xs mb-1.5">Description</FieldLabel>
            <Textarea
              placeholder="Enter group description…"
              className="bg-white/[0.05] border-white/10 text-white placeholder:text-white/30 min-h-[90px]"
              onChange={(e) => { e.stopPropagation(); setgroupdescription(e.target.value) }}
            />
          </Field>
          <Button
            variant="outline"
            className="w-full bg-indigo-500 border-indigo-500 text-white hover:bg-indigo-600 hover:border-indigo-600 hover:text-white"
            onClick={(e) => { e.stopPropagation(); handlecreategroup() }}
          >
            <UsersRound size={14} className="mr-2" />
            Create group
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
