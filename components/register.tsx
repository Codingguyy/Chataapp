"use client"
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Field } from "./ui/field";
import { FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { InputGroup } from "./ui/input-group";
import { InputGroupInput } from "./ui/input-group";
import { InputGroupAddon } from "./ui/input-group";
import { User, Mail, Lock, ArrowRight, MessageSquare } from "lucide-react";
import { Userregister } from "./store";
import { Toklue } from "./store";
import { UsercurrentId } from "./store";
import Registerr from "@/actions/register";
import Loginuser from "@/actions/loginuser";
import Authenticate from "@/actions/authenticate";
import Checkusername from "@/actions/checkusername";
import Checkuseremail from "@/actions/checkuseremail";
import { set } from "@/socketserver/clientsidesocket";
import { on } from "@/socketserver/clientsidesocket";
import toast from "react-hot-toast";
export default function Register(){
    const router=useRouter()
    const name=Userregister(s=>s.name)
    const email=Userregister(s=>s.email)
    const password=Userregister(s=>s.password)
    const setemail=Userregister(s=>s.setemail)
    const setpassword=Userregister(s=>s.setpassword)
    const setname=Userregister(s=>s.setname)
    const setoken=Toklue(s=>s.setname)
    const setusercurrentid=UsercurrentId(s=>s.setname)
    function handleemail(value:string){
        setemail(value)
    }
    function handlepassword(value:string){
        setpassword(value)
    }
    function handlename(value:string){
        setname(value)
    }
    async function handleregister(){
            const message=await Registerr({name:name,password:password,email:email})
            if(message!=="Already login"&&message!=="Error Registering"&&message!=="Email already in use"&&message!=="Username already taken"){
            const response=await Loginuser({name:name,email:email,password:password})
            if(response==="Dont have an Account"){
                router.push("/register")
            }
            else if(response!=="Error happened during verifying"){
            const token=await Authenticate({email:email,password:password})
            setoken(token)
            setusercurrentid(response?._id)
            set("register:request",{token:token,name:name,email:email,_id:response?._id})
            }
            else{
              toast.error("Error happened during Registering")
            }
            }
            else if(message==="Already login"){
            router.push("/login")
        }
         else if(message==="Username already taken"){
            toast.error(`${name} is already taken`)
         }
         else if(message==="Email already in use"){
            toast.error(`${email} is already in use`)
         }
        else if(message==="Error Registering"){
            toast.error("Error happened during Registering")
        }
    }
         
    useEffect(()=>{
       on("login/register",(value)=>{
        if(value){
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
                <h2 className="text-white text-lg font-semibold mt-1">Create an account</h2>
                <p className="text-white/40 text-xs">Join NexChat in a few seconds</p>
            </div>

            <Field>
                <FieldLabel htmlFor="Name" className="text-white/60 text-xs">Name</FieldLabel>
                <InputGroup>
                    <InputGroupInput
                        value={name}
                        id="Name"
                        placeholder="Your name"
                        onChange={(e)=>{e.stopPropagation();handlename(e.target.value)}}
                        className="bg-white/[0.05] border-white/10 text-white placeholder:text-white/30 focus:border-indigo-500/50"
                    />
                    <InputGroupAddon align="inline-start"><User size={15} className="text-white/40" /></InputGroupAddon>
                </InputGroup>
            </Field>
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
                        placeholder="Create a password"
                        onChange={(e)=>{e.stopPropagation();handlepassword(e.target.value)}}
                        className="bg-white/[0.05] border-white/10 text-white placeholder:text-white/30 focus:border-indigo-500/50"
                    />
                    <InputGroupAddon align="inline-start"><Lock size={15} className="text-white/40" /></InputGroupAddon>
                </InputGroup>
            </Field>

            <Button
                variant={"outline"}
                className="w-full h-10 mt-1 bg-indigo-500 border-indigo-500 text-white font-medium hover:bg-indigo-600 hover:border-indigo-600 hover:text-white transition-colors"
                onClick={(e)=>{e.stopPropagation();handleregister()}}
            >
                Create account
            </Button>

            <Field orientation={"horizontal"} className="justify-center gap-1.5 mt-1">
                <FieldLabel htmlFor="Donthaveanaccount" className="text-white/40 text-xs font-normal">Already have an account?</FieldLabel>
                <Button
                    id="Donthaveanaccount"
                    variant={"link"}
                    className="text-indigo-400 hover:text-indigo-300 text-xs h-auto p-0 gap-1"
                    onClick={(e)=>{e.stopPropagation();router.push("/login")}}
                >
                    Sign in <ArrowRight size={13} />
                </Button>
            </Field>
            </Card>)
}
