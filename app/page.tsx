"use client"
import {useEffect} from "react"
import {useRouter} from "next/navigation"
export default function Pagee(){
  const router=useRouter()
  useEffect(()=>{
    router.push("/register")
  },[])
  return(<></>)
}
