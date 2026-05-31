"use client"

import React, { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { MonitorPlay, MessageSquare, Video, FilePlus, ChevronDown, X } from "lucide-react"
import { useSourceProjectStore } from "@/lib/sourceProjectStore"

const WIZARDS = [
  {
    type: "Presentation",
    label: "Presentation",
    icon: MonitorPlay,
    color: "text-blue-600",
  },
  {
    type: "AI Chat-avatar",
    label: "AI Chat-avatar",
    icon: MessageSquare,
    color: "text-emerald-600",
  },
  {
    type: "Video project",
    label: "Video project",
    icon: Video,
    color: "text-violet-600",
  },
  {
    type: "Blank slide",
    label: "Start with blank slide",
    icon: FilePlus,
    color: "text-slate-600",
  },
]

export default function ProjectsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"my" | "shared">("my")
  const { projects, addProject } = useSourceProjectStore()
  
  // Dropdown state
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Modal state
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedType, setSelectedType] = useState(WIZARDS[0])
  const [projectName, setProjectName] = useState("")

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSelectWizard = (wizard: typeof WIZARDS[0]) => {
    setDropdownOpen(false)
    setSelectedType(wizard)
    setProjectName(`New ${wizard.label}`)
    setModalOpen(true)
  }

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!projectName.trim()) return
    addProject(projectName.trim(), selectedType.type)
    setModalOpen(false)
  }

  return (
    <div className="px-8 py-8 w-full bg-slate-50 min-h-full relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-extrabold text-[#0B132B]">My Projects</h1>
        
        {/* Create Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="bg-[#0066FF] hover:bg-blue-600 text-white font-semibold py-2.5 px-5 rounded-lg transition-colors shadow-sm flex items-center gap-2"
          >
            Create project
          </button>
          
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-slate-100 py-2 z-10 animate-in fade-in slide-in-from-top-2 duration-150">
              {WIZARDS.map((w) => {
                const Icon = w.icon
                return (
                  <button
                    key={w.type}
                    onClick={() => handleSelectWizard(w)}
                    className="w-full text-left px-4 py-2.5 hover:bg-slate-50 transition-colors flex items-center gap-3 text-[15px] font-medium text-slate-700"
                  >
                    <Icon size={18} className="text-slate-600" />
                    {w.label}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Tabs and Toolbar */}
        <div className="flex items-center justify-between px-5 pt-3 border-b border-slate-100">
          <div className="flex gap-6">
            <button
              onClick={() => setActiveTab("my")}
              className={`pb-3 text-sm font-medium transition-colors border-b-2 ${
                activeTab === "my"
                  ? "text-slate-900 border-[#0066FF]"
                  : "text-slate-500 border-transparent hover:text-slate-700"
              }`}
            >
              My projects
            </button>
            <button
              onClick={() => setActiveTab("shared")}
              className={`pb-3 text-sm font-medium transition-colors border-b-2 ${
                activeTab === "shared"
                  ? "text-slate-900 border-[#0066FF]"
                  : "text-slate-500 border-transparent hover:text-slate-700"
              }`}
            >
              Shared with me
            </button>
          </div>

          <div className="flex items-center gap-2 pb-3">
            <button className="px-3 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded hover:bg-slate-50 transition-colors">
              Filters
            </button>
            <button className="px-3 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded hover:bg-slate-50 transition-colors">
              Columns
            </button>
            <button className="px-3 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded hover:bg-slate-50 transition-colors">
              Expand
            </button>
          </div>
        </div>

        {/* Table Header */}
        <div className="bg-slate-50 border-b border-slate-100 grid grid-cols-[40px_minmax(150px,1fr)_minmax(100px,1fr)_minmax(120px,1fr)_minmax(80px,1fr)_minmax(100px,1fr)_minmax(100px,1fr)_minmax(100px,1fr)] px-5 py-3 items-center">
          <div>
            <input type="checkbox" className="rounded border-slate-300 text-[#0066FF] focus:ring-[#0066FF]" />
          </div>
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Project</div>
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Preview</div>
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Assistant</div>
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Links</div>
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Analytics</div>
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Settings</div>
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Created</div>
        </div>

        {/* Table Body */}
        {projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 bg-white">
            <p className="text-[#64748B] text-sm font-medium">No projects found.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {projects.map((p) => (
              <div key={p.id} className="grid grid-cols-[40px_minmax(150px,1fr)_minmax(100px,1fr)_minmax(120px,1fr)_minmax(80px,1fr)_minmax(100px,1fr)_minmax(100px,1fr)_minmax(100px,1fr)] px-5 py-4 items-center hover:bg-slate-50 transition-colors">
                <div>
                  <input type="checkbox" className="rounded border-slate-300 text-[#0066FF] focus:ring-[#0066FF]" />
                </div>
                <div className="text-sm font-bold text-slate-900 truncate pr-4">{p.name}</div>
                <div className="text-sm text-slate-500">-</div>
                <div className="text-sm text-slate-500">
                  <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-xs font-medium">{p.type}</span>
                </div>
                <div className="text-sm text-slate-500">0</div>
                <div className="text-sm text-slate-500">0 views</div>
                <div className="text-sm text-slate-500">Public</div>
                <div className="text-sm text-slate-500">{new Date(p.createdAt).toLocaleDateString()}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setModalOpen(false)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <selectedType.icon size={18} className={selectedType.color} />
                Create {selectedType.label}
              </h2>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-5 flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">Project Name</label>
                <input
                  autoFocus
                  required
                  type="text"
                  value={projectName}
                  onChange={e => setProjectName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg border border-slate-200 font-medium">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 text-sm text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg font-medium shadow-sm">
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
