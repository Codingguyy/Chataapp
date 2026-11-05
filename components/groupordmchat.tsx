"use client"
import Image from 'next/image'
import Manimge from '@/images/man.png'
import Messagesarea from '@/components/messagesarea'
import Messagebar from '@/components/messagebar'
import Onetooneconversationname from '@/components/onetooneconversationname'
import Onetooneconversationfunctions from '@/components/onetooneconversationfunctions'
import { Chatypepicked } from "./store"
import { Groupsettings } from './store'
import Groupmessagesarea from './groupmessagesarea'
import Groupmessagesbar from './groupmessagesbar'
import Groupname from './groupname'
import Groupfunctions from './groupfunctions'
import Groupsettingss from './groupsettings'

export default function Groupordmchat() {
    const chatypepicked = Chatypepicked(s => s.type)
    const groupsettings = Groupsettings(s => s.value)

    return (
        <>
            {chatypepicked === "dm" ? (
                <>
                    <div className="w-full flex items-center gap-3 h-16 px-4 sm:px-6 bg-[#111111] border-b border-white/[0.06] flex-shrink-0">
                        <Image src={Manimge} alt="Avatar" className="h-10 w-10 rounded-full object-cover flex-shrink-0" />
                        <Onetooneconversationname />
                        <Onetooneconversationfunctions />
                    </div>
                    <Messagesarea />
                    <Messagebar />
                </>
            ) : (
                <>
                    <div className="w-full flex items-center gap-3 h-16 px-4 sm:px-6 bg-[#111111] border-b border-white/[0.06] flex-shrink-0">
                        <Image src={Manimge} alt="Group avatar" className="h-10 w-10 rounded-full object-cover flex-shrink-0" />
                        <Groupname />
                        <Groupfunctions />
                    </div>
                    {groupsettings ? <Groupsettingss /> : <><Groupmessagesarea /><Groupmessagesbar /></>}
                </>
            )}
        </>
    )
}
