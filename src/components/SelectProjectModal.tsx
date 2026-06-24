import React, { useState, useEffect } from "react"
import { X, Search } from "lucide-react"
import { supabase } from "@/lib/supabase"

export default function SelectProjectModal({ isOpen, onClose, onAdd }: { isOpen: boolean, onClose: () => void, onAdd: (name: string, type: string) => void }) {
  const [projects, setProjects] = useState<any[]>([])
  const [search, setSearch] = useState("")

  useEffect(() => {
    if (isOpen) {
      supabase.from('projects').select('*').order('created_at', { ascending: false }).limit(20).then(({ data }) => {
        if (data) setProjects(data)
      })
    }
  }, [isOpen])

  if (!isOpen) return null

  const filtered = projects.filter(p => p.title?.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[80vh]" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-800">Add from existing projects</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4 border-b border-slate-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search projects..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-sm">No projects found.</div>
          ) : (
            <div className="flex flex-col gap-1">
              {filtered.map(p => (
                <div key={p.id} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg group transition-colors cursor-pointer border border-transparent hover:border-slate-100" onClick={() => { onAdd(p.title, p.type || 'Presentation'); onClose(); }}>
                  <div>
                    <div className="font-medium text-slate-800 text-sm">{p.title || 'Untitled'}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{p.type || 'Presentation'} • {new Date(p.created_at).toLocaleDateString()}</div>
                  </div>
                  <button className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 text-xs font-medium rounded-md opacity-0 group-hover:opacity-100 hover:border-blue-500 hover:text-blue-600 transition-all">
                    Add as Source
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
