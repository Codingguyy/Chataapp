"use client"
import { Dialog } from "./ui/dialog"
import { DialogTrigger } from "./ui/dialog"
import { DialogHeader } from "./ui/dialog"
import { DialogTitle } from "./ui/dialog"
import { DialogDescription } from "./ui/dialog"
import { DialogContent } from "./ui/dialog"
import { Button } from "./ui/button"
import { InputGroup } from "./ui/input-group"
import { InputGroupInput } from "./ui/input-group"
import { InputGroupAddon } from "./ui/input-group"
import { InputGroupButton } from "./ui/input-group"
import { Field } from "./ui/field"
import { FieldLabel } from "./ui/field"
import { Textarea } from "./ui/textarea"
import { Badge } from "./ui/badge"
import { Spinner } from "./ui/spinner"
import { User, UserPen, AlertCircle, Check } from "lucide-react"
import { Profile as Prfle } from "./store"
import { UsercurrentId } from "./store"
import { Toklue } from "./store"
import Changename from "@/actions/changename"
import Changedescription from "@/actions/changedescription"
import toast from "react-hot-toast"
import { set } from "@/socketserver/clientsidesocket"

export default function Profile() {
  const name = Prfle(s => s.name)
  const description = Prfle(s => s.description)
  const setname = Prfle(s => s.setname)
  const setdescription = Prfle(s => s.setdescription)
  const isnamechanging = Prfle(s => s.ischangingname)
  const isdescriptionchanging = Prfle(s => s.ischangingdescription)
  const setisnamechanging = Prfle(s => s.setisnamechanging)
  const setisdescriptionchanging = Prfle(s => s.setisdescriptionchanging)
  const isnamechangedmessage = Prfle(s => s.isnamechangedmessage)
  const isdescriptionchangedmessage = Prfle(s => s.isdescriptionchangedmessage)
  const setisnamechangedmessage = Prfle(s => s.setisnamechangedmessage)
  const setisdescriptionchangedmessage = Prfle(s => s.setisdescriptionchangedmessage)
  const usercurrentid = UsercurrentId(s => s.name)
  const toklue = Toklue(s => s.name)

  function handlename(value: string) {
    setisdescriptionchangedmessage("")
    setname(value)
  }
  function handledescription(value: string) {
    setisnamechangedmessage("")
    setdescription(value)
  }
  async function handlechangename() {
    if (name.length > 0) {
      setisnamechanging(true)
      const response = await Changename(usercurrentid, name)
      setisnamechangedmessage(response)
      setisnamechanging(false)
      if (response === "Name changed successfully") {
        set("request:namechange:onetooneconversation", { token: toklue, name: name })
      }
    } else {
      toast.error("Enter name")
    }
  }
  async function handlechangedescription() {
    if (description.length > 0) {
      setisdescriptionchanging(true)
      const response = await Changedescription(usercurrentid, description)
      setisdescriptionchangedmessage(response)
      setisdescriptionchanging(false)
      if (response === "Description changed successfully") {
        set("request:descriptionchange:onetooneconversation", { token: toklue, description: description })
      }
    } else {
      toast.error("Enter description")
    }
  }

  const nameSuccess = isnamechangedmessage === "Name changed successfully"
  const descSuccess = isdescriptionchangedmessage === "Description changed successfully"

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="h-8 w-8 rounded-full bg-white/[0.06] hover:bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors">
          <User size={15} />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[460px] bg-[#141414] border-white/10 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white">
            <span>Profile settings</span>
            {(isnamechangedmessage || isdescriptionchangedmessage) && (
              <Badge
                variant="outline"
                className={`text-[10px] px-2 py-0.5 border-0 flex items-center gap-1 ${
                  (isnamechangedmessage ? nameSuccess : descSuccess) ? "bg-emerald-500/15 text-emerald-400" : "bg-red-500/15 text-red-400"
                }`}
              >
                {(isnamechangedmessage ? nameSuccess : descSuccess) ? <Check size={10} /> : <AlertCircle size={10} />}
                {isnamechangedmessage || isdescriptionchangedmessage}
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription className="text-white/40">Update how you appear to others</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-5 py-2">
          <Field>
            <FieldLabel htmlFor="Name" className="text-white/60 text-xs mb-1.5">Name</FieldLabel>
            <InputGroup id="Name">
              <InputGroupInput
                value={name}
                placeholder="Enter new name…"
                onChange={(e) => { e.stopPropagation(); handlename(e.target.value) }}
                className="bg-white/[0.05] border-white/10 text-white placeholder:text-white/30"
              />
              <InputGroupAddon align="inline-start"><UserPen size={15} className="text-white/40" /></InputGroupAddon>
              <InputGroupAddon align="inline-end">
                <InputGroupButton
                  variant="outline"
                  className="text-xs border-white/10 bg-white/[0.05] text-white/70 hover:text-white hover:bg-white/10"
                  disabled={isnamechanging}
                  onClick={(e) => { e.stopPropagation(); handlechangename() }}
                >
                  {isnamechanging ? <Spinner /> : "Save"}
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
          </Field>

          <Field>
            <FieldLabel htmlFor="Description" className="w-full flex items-center justify-between text-white/60 text-xs mb-1.5">
              <span>Description</span>
              <Button
                variant="outline"
                size="sm"
                disabled={isdescriptionchanging}
                className="h-6 text-xs border-white/10 bg-white/[0.05] text-white/70 hover:text-white hover:bg-white/10"
                onClick={(e) => { e.stopPropagation(); handlechangedescription() }}
              >
                {isdescriptionchanging ? <Spinner /> : "Save"}
              </Button>
            </FieldLabel>
            <Textarea
              id="Description"
              value={description}
              placeholder="Enter description…"
              onChange={(e) => { e.stopPropagation(); handledescription(e.target.value) }}
              className="bg-white/[0.05] border-white/10 text-white placeholder:text-white/30 min-h-[90px]"
            />
          </Field>
        </div>
      </DialogContent>
    </Dialog>
  )
}
