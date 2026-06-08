"use client"

import React from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, Play, Maximize } from "lucide-react"

export default function PreviewPage() {
  const router = useRouter()
  const params = useParams()
  const projectId = params?.id as string

  return (
    <div className="flex flex-col h-screen bg-[#0B132B]">
      {/* Top Navbar */}
      <div className="h-14 bg-[#151D35] border-b border-slate-800 flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={() => router.push("/projects")} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 transition-colors">
            <ArrowLeft size={18} />
          </button>
          <div className="font-semibold text-white">Preview: {projectId}</div>
        </div>
        <div className="flex items-center gap-3 text-slate-400">
          <button className="p-2 hover:text-white transition-colors"><Maximize size={18} /></button>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="flex flex-1 overflow-hidden items-center justify-center p-8">
        <div className="w-[960px] h-[540px] bg-black rounded-xl shadow-2xl relative overflow-hidden flex items-center justify-center group cursor-pointer border border-slate-800">
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-900/40 to-black pointer-events-none" />
          <div className="w-20 h-20 bg-indigo-600/90 rounded-full flex items-center justify-center text-white shadow-xl transform group-hover:scale-110 transition-transform duration-300">
            <Play size={32} className="ml-2" />
          </div>
          <div className="absolute bottom-6 left-6 text-white font-medium drop-shadow-md">
            Interactive Presentation
          </div>
        </div>
      </div>
    </div>
  )
}
