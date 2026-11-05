import Image from 'next/image'
import Messageimage from '@/images/messages.png'
import Navigateonetooneconversation from '@/components/navigateonetooneconversation'

export default async function Chatpage(){
    return(
       <div className="relative hidden sm:flex sm:w-[68%] h-full flex-col items-center justify-center bg-[#0a0a0a]">
        <div className="flex flex-col items-center px-6 max-w-sm text-center">
            <div className="h-20 w-20 rounded-2xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mb-6">
                <Image src={Messageimage} alt="Messages" height={40} width={40} className="opacity-60" />
            </div>
            <h2 className="text-white text-xl font-semibold mb-2">Your messages</h2>
            <p className="text-white/40 text-sm leading-relaxed">Search for people or groups, or pick an existing conversation from the left to start chatting.</p>
        </div>
        {<Navigateonetooneconversation/>}
    </div>
    )
}
