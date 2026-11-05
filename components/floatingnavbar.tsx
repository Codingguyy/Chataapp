"use client"
import Groupcreate from './groupcreate'
import Sendrequests from './sendrequests'
import Recieverequests from './request'
import Profile from './profile'
import Grouprequests from './grouprequests'
import { Menu, X, MessageSquare } from 'lucide-react'
import { useState } from 'react'

export default function Floatingnavbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      
      <nav className="fixed top-0 left-0 right-0 z-50 h-14 bg-[#0f0f0f] border-b border-white/[0.06] flex items-center px-4 gap-2">
        
        <div className="flex items-center gap-2 mr-2">
          <div className="h-7 w-7 rounded-lg bg-indigo-500 flex items-center justify-center flex-shrink-0">
            <MessageSquare size={14} className="text-white" />
          </div>
          <span className="text-white font-semibold text-sm tracking-tight hidden sm:block">NexChat</span>
        </div>

       
        <div className="hidden sm:flex items-center gap-1 flex-1">
          <Sendrequests />
          <Recieverequests />
          <Grouprequests />
          <Groupcreate />
        </div>

        
        <div className="ml-auto flex items-center gap-2">
          <div className="hidden sm:block">
            <Profile />
          </div>
          
          <button
            className="sm:hidden h-8 w-8 rounded-md bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </nav>

    
      {mobileOpen && (
        <div className="fixed inset-0 z-40 sm:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="absolute top-14 left-0 right-0 bg-[#111111] border-b border-white/[0.06] p-3 flex flex-col gap-2" onClick={() => setMobileOpen(false)}>
            <Sendrequests />
            <Recieverequests />
            <Grouprequests />
            <Groupcreate />
            <Profile />
          </div>
        </div>
      )}
    </>
  )
}
