"use client"
import {usePathname} from "next/navigation"
import Floatingnavbar from '@/components/floatingnavbar'
export default function Floatingbarcomponent(){
  const pathname=usePathname()
  const showbar= (pathname==="/register"||pathname==="/login")??false
  return (<>{!showbar?<Floatingnavbar/>:<></>}</>)
}
