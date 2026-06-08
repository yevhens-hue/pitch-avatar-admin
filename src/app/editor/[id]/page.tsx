"use client"

import React from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, Save, Layout, Type, Image as ImageIcon, Sparkles } from "lucide-react"

export default function EditorPage() {
  const router = useRouter()
  const params = useParams()
  const projectId = params?.id as string

  return (
    <div className="flex flex-col h-screen bg-slate-100">
      {/* Top Navbar */}
      <div className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={() => router.push("/projects")} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors">
            <ArrowLeft size={18} />
          </button>
          <div className="font-semibold text-slate-800">Editing Project: {projectId}</div>
        </div>
        <div className="flex items-center gap-3">
          <button className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Preview</button>
          <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors">
            <Save size={16} /> Save
          </button>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Toolbar */}
        <div className="w-16 bg-white border-r border-slate-200 flex flex-col items-center py-4 gap-4">
          <button className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"><Layout size={20} /></button>
          <button className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"><Type size={20} /></button>
          <button className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"><ImageIcon size={20} /></button>
          <button className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors mt-auto"><Sparkles size={20} /></button>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 bg-slate-50 overflow-auto p-8 flex items-center justify-center">
          <div className="w-[800px] h-[450px] bg-white rounded-xl shadow-sm border border-slate-200 flex items-center justify-center text-slate-400 font-medium">
            Project Canvas
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-64 bg-white border-l border-slate-200 p-4">
          <h3 className="text-sm font-bold text-slate-800 mb-4">Properties</h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">Background</label>
              <div className="h-10 border border-slate-200 rounded-lg flex items-center px-3 text-sm text-slate-500 bg-slate-50">#FFFFFF</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
