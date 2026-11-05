"use client"
import React from 'react'
import { useRouter } from 'next/navigation'
import { Card } from "./ui/card"
import { Field } from "./ui/field"
import { FieldLabel } from "./ui/field"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { InputGroup } from "./ui/input-group"
import { InputGroupInput } from "./ui/input-group"
import { InputGroupAddon } from "./ui/input-group"
import { Mail, Lock, ArrowRight, MessageSquare } from "lucide-react"
import { Userlogin } from "./store"
import { Toklue } from './store'
import { UsercurrentId } from './store'
import { Logincount } from './store'
import Loginuser from "@/actions/loginuser"
import Authenticate from "@/actions/authenticate"
import { set } from "@/socketserver/clientsidesocket"
import { on } from "@/socketserver/clientsidesocket"
import toast from 'react-hot-toast'
export default function Login(){
    const router=useRouter()
    const email=Userlogin(s=>s.email)
    const password=Userlogin(s=>s.password)
    const setemail=Userlogin(s=>s.setemail)
    const setpassword=Userlogin(s=>s.setpassword)
    const setoken=Toklue(s=>s.setname)
    const usercurrentid=UsercurrentId(s=>s.name)
    const setusercurrentid=UsercurrentId(s=>s.setname)
    const login=Logincount(s=>s.count)
    const count=Logincount(s=>s.count)
    const setcount=Logincount(s=>s.setcount)
    function handleemail(value:string){
        setemail(value)
    }
    function handlepassword(value:string){
        setpassword(value)
    }
    function handledonthaveanaccount(){
        if(count>3){
            router.push("/register")
        }
        else{
            toast.error(`You have made an ${count} unsuccessfull attempt`)
            setcount(count+1)
        }
    }
    async function handleverify(){
        if(email&&password){
           const response=await Loginuser({name:"",email:email,password:password})
           if(response==="Dont have an Account"){
              handledonthaveanaccount()
           }
           else if(response!=="Error happened during verifying"){
           const token=await Authenticate({email:email,password:password})
           setoken(token)
           setusercurrentid(response?._id)
           if(token){
            set("login:request",{token:token,email:email})
            setcount(0)
           }
           else{
            toast.error("An error occured")
           }
           }
        }
    }
    React.useEffect(()=>{
        on("login/register",(data)=>{
            if(data){
              router.push("/chat")
            }
        })
    },[])
    return(
    <Card className="flex flex-col gap-5 px-6 py-8 mx-4 my-12 w-[calc(100%-2rem)] max-w-[380px] md:w-[400px] md:px-8 md:py-10 lg:w-[420px] bg-white/[0.04] backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl">
            <div className="flex flex-col items-center gap-2 mb-1">
                <div className="h-11 w-11 rounded-xl bg-indigo-500 flex items-center justify-center">
                    <MessageSquare size={20} className="text-white" />
                </div>
                <h2 className="text-white text-lg font-semibold mt-1">Welcome back</h2>
                <p className="text-white/40 text-xs">Sign in to continue to NexChat</p>
            </div>

            <Field>
                <FieldLabel htmlFor="Email" className="text-white/60 text-xs">Email</FieldLabel>
                <InputGroup>
                    <InputGroupInput
                        value={email}
                        id="Email"
                        placeholder="you@example.com"
                        onChange={(e)=>{e.stopPropagation();handleemail(e.target.value)}}
                        className="bg-white/[0.05] border-white/10 text-white placeholder:text-white/30 focus:border-indigo-500/50"
                    />
                    <InputGroupAddon align="inline-start"><Mail size={15} className="text-white/40" /></InputGroupAddon>
                </InputGroup>
            </Field>
            <Field>
                <FieldLabel htmlFor="Password" className="text-white/60 text-xs">Password</FieldLabel>
                <InputGroup>
                    <InputGroupInput
                        value={password}
                        id="Password"
                        type="password"
                        placeholder="Enter your password"
                        onChange={(e)=>{e.stopPropagation();handlepassword(e.target.value)}}
                        className="bg-white/[0.05] border-white/10 text-white placeholder:text-white/30 focus:border-indigo-500/50"
                    />
                    <InputGroupAddon align="inline-start"><Lock size={15} className="text-white/40" /></InputGroupAddon>
                </InputGroup>
            </Field>

            <Button
                variant={"outline"}
                className="w-full h-10 mt-1 bg-indigo-500 border-indigo-500 text-white font-medium hover:bg-indigo-600 hover:border-indigo-600 hover:text-white transition-colors"
                onClick={(e)=>{e.stopPropagation();handleverify()}}
            >
                Sign in
            </Button>

            <Field orientation={"horizontal"} className="justify-center gap-1.5 mt-1">
                <FieldLabel htmlFor="Donthaveanaccount" className="text-white/40 text-xs font-normal">Don't have an account?</FieldLabel>
                <Button
                    id="Donthaveanaccount"
                    variant={"link"}
                    className="text-indigo-400 hover:text-indigo-300 text-xs h-auto p-0 gap-1"
                    onClick={(e)=>{e.stopPropagation();router.push("/register")}}
                >
                    Register <ArrowRight size={13} />
                </Button>
            </Field>
            </Card>)
}
