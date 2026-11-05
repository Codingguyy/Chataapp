"use client"
import React from 'react'
import { useRouter } from "next/navigation"
import { Onetooneconversationdetails } from "./store"
import { Parmkey } from "./store"
export default function Navigateonetooneconversation(){
   const router=useRouter()
   const parmkey=Parmkey(s=>s.name)
   const onetooneconversationdetails=Onetooneconversationdetails(s=>s.onetooneconversationdetails)
   React.useEffect(()=>{
    if(onetooneconversationdetails&&parmkey){
        router.push(`/chat/${parmkey}`)
    }
   },[onetooneconversationdetails,parmkey])
   return(<></>)
}
