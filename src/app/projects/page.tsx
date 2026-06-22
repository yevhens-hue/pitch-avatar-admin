"use client"

import React, { useState, useRef, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { MonitorPlay, MessageSquare, Video, FilePlus, ChevronDown, Check } from "lucide-react"
import { useSourceProjectStore } from "@/lib/sourceProjectStore"
import CreateProjectModal, { ModalTabId } from "@/components/CreateProjectModal/CreateProjectModal"

const DROPDOWN_ITEMS: { type: ModalTabId; label: string; icon: any; color: string }[] = [
  { type: "file", label: "Presentation", icon: MonitorPlay, color: "text-blue-600" },
  { type: "ai", label: "AI Chat Avatar", icon: MessageSquare, color: "text-emerald-600" },
]

const getEditUrl = (p: any) => {
  const params = new URLSearchParams({ name: p.name, id: p.id })
  switch (p.type) {
    case "Video project":
    case "Video":
      return `/create/video?${params}&tab=video`
    case "AI Chat-avatar":
      return `/create/scratch?${params}&tab=ai`
    case "Blank slide":
      return `/create/scratch?${params}&tab=scratch`
    case "Presentation":
    default:
      return `/create/quick?${params}&tab=file`
  }
}

function ProjectsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const typeParam = searchParams.get("type")
  const [activeTab, setActiveTab] = useState<"my" | "shared">("my")
  const { projects } = useSourceProjectStore()
  
  // Local filters
  const [typeFilter, setTypeFilter] = useState(typeParam || "All Types")
  const [statusFilter, setStatusFilter] = useState("All Status")

  // Checkbox state
  const [selectedProjects, setSelectedProjects] = useState<Set<string>>(new Set())

  // Filter dropdowns state
  const [typeDropdownOpen, setTypeDropdownOpen] = useState(false)
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false)
  
  const typeDropdownRef = useRef<HTMLDivElement>(null)
  const statusDropdownRef = useRef<HTMLDivElement>(null)

  // Determine display projects
  const displayProjects = (activeTab === "shared" ? [] : projects).filter((p) => {
    // URL param type overrides local if they differ, but we synced them on mount.
    const currentType = typeParam || typeFilter
    const typeMatch = currentType === "All Types" || p.type === currentType
    return typeMatch
  })

  // Sync typeFilter with URL typeParam if it changes from sidebar
  useEffect(() => {
    if (typeParam) {
      setTypeFilter(typeParam)
    } else {
      setTypeFilter("All Types")
    }
  }, [typeParam])

  const toggleSelectAll = () => {
    if (selectedProjects.size === displayProjects.length && displayProjects.length > 0) {
      setSelectedProjects(new Set())
    } else {
      setSelectedProjects(new Set(displayProjects.map(p => p.id)))
    }
  }

  const toggleSelectProject = (id: string) => {
    const newSet = new Set(selectedProjects)
    if (newSet.has(id)) newSet.delete(id)
    else newSet.add(id)
    setSelectedProjects(newSet)
  }

  // Dropdown state for "Create project"
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Modal state
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedTab, setSelectedTab] = useState<ModalTabId>("file")

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
      if (typeDropdownRef.current && !typeDropdownRef.current.contains(event.target as Node)) {
        setTypeDropdownOpen(false)
      }
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target as Node)) {
        setStatusDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSelectWizard = (tabId: ModalTabId) => {
    setDropdownOpen(false)
    setSelectedTab(tabId)
    setModalOpen(true)
  }

  // Determine Title based on URL param
  const pageTitle = typeParam ? `${typeParam}s` : "Projects"

  const types = ["All Types", "Presentation", "AI Chat-avatar", "Video"]
  const statuses = ["All Status", "Draft", "Published", "Failed"]

  return (
    <div className="px-8 py-8 w-full bg-slate-50 min-h-full relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-extrabold text-[#0B132B]">{pageTitle}</h1>
        
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
              {DROPDOWN_ITEMS.map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.type}
                    onClick={() => handleSelectWizard(item.type)}
                    className="w-full text-left px-4 py-2.5 hover:bg-slate-50 transition-colors flex items-center gap-3 text-[15px] font-medium text-slate-700"
                  >
                    <Icon size={18} className={item.color} />
                    {item.label}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Main Card (Table) */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-visible mt-6 relative z-0">
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

          <div className="flex items-center gap-3 pb-3 relative z-10">
            {/* Type Filter */}
            <div className="relative" ref={typeDropdownRef}>
              <button 
                onClick={() => setTypeDropdownOpen(!typeDropdownOpen)}
                className="flex items-center justify-between min-w-[140px] px-3 py-2 text-[15px] text-slate-700 bg-white border border-slate-200 rounded-lg hover:border-slate-300 transition-colors"
              >
                <span>{typeFilter}</span>
                <ChevronDown size={16} className="text-slate-400 ml-2" />
              </button>
              {typeDropdownOpen && (
                <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1.5 z-20">
                  {types.map(t => (
                    <button
                      key={t}
                      onClick={() => {
                        setTypeFilter(t);
                        setTypeDropdownOpen(false);
                        if (t === "All Types") {
                          router.push("/projects");
                        } else {
                          router.push(`/projects?type=${t}`);
                        }
                      }}
                      className="w-full text-left px-4 py-2 flex items-center text-[15px] text-slate-700 hover:bg-slate-50"
                    >
                      <div className="w-6">{typeFilter === t && <Check size={16} />}</div>
                      {t}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Status Filter */}
            <div className="relative" ref={statusDropdownRef}>
              <button 
                onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
                className="flex items-center justify-between min-w-[120px] px-3 py-2 text-[15px] text-slate-700 bg-white border border-slate-200 rounded-lg hover:border-slate-300 transition-colors"
              >
                <span>{statusFilter}</span>
                <ChevronDown size={16} className="text-slate-400 ml-2" />
              </button>
              {statusDropdownOpen && (
                <div className="absolute right-0 mt-1 w-40 bg-white rounded-lg shadow-lg border border-slate-200 py-1.5 z-20">
                  {statuses.map(s => (
                    <button
                      key={s}
                      onClick={() => {
                        setStatusFilter(s);
                        setStatusDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-[15px] hover:bg-blue-50 hover:text-blue-600 transition-colors ${statusFilter === s ? 'text-blue-600 bg-blue-50' : 'text-slate-700'}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Table Header */}
        <div className="bg-slate-50 border-b border-slate-100 grid grid-cols-[40px_minmax(150px,2fr)_minmax(80px,1fr)_minmax(60px,1fr)_minmax(100px,1fr)_minmax(100px,1fr)_minmax(100px,1fr)_minmax(100px,1fr)_minmax(100px,1fr)] px-5 py-3 items-center">
          <div>
            <input 
              type="checkbox" 
              checked={displayProjects.length > 0 && selectedProjects.size === displayProjects.length}
              onChange={toggleSelectAll}
              className="rounded border-slate-300 text-[#0066FF] focus:ring-[#0066FF] cursor-pointer" 
            />
          </div>
          <div className="text-[12px] font-medium text-slate-500">Project</div>
          <div className="text-[12px] font-medium text-slate-500">Preview</div>
          <div className="text-[12px] font-medium text-slate-500">Edit</div>
          <div className="text-[12px] font-medium text-slate-500">Type</div>
          <div className="text-[12px] font-medium text-slate-500">AI Avatar</div>
          <div className="text-[12px] font-medium text-slate-500">Author</div>
          <div className="text-[12px] font-medium text-slate-500">Created</div>
          <div className="text-[12px] font-medium text-slate-500">Language</div>
        </div>

        {/* Table Body */}
        {displayProjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 bg-white">
            <p className="text-[#64748B] text-sm font-medium">No projects found.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {displayProjects.map((p) => (
              <div key={p.id} className="grid grid-cols-[40px_minmax(150px,2fr)_minmax(80px,1fr)_minmax(60px,1fr)_minmax(100px,1fr)_minmax(100px,1fr)_minmax(100px,1fr)_minmax(100px,1fr)_minmax(100px,1fr)] px-5 py-4 items-center hover:bg-slate-50 transition-colors">
                <div>
                  <input 
                    type="checkbox" 
                    checked={selectedProjects.has(p.id)}
                    onChange={() => toggleSelectProject(p.id)}
                    className="rounded border-slate-300 text-[#0066FF] focus:ring-[#0066FF] cursor-pointer" 
                  />
                </div>
                <div className="text-sm font-medium text-slate-900 truncate pr-4">{p.name}</div>
                <div onClick={() => router.push(`/preview/${p.id}`)} className="text-sm text-slate-500 cursor-pointer hover:text-blue-600 transition-colors">Preview</div>
                <div onClick={() => router.push(getEditUrl(p))} className="text-sm text-blue-600 font-medium cursor-pointer">Edit</div>
                <div className="text-sm text-slate-500">{p.type}</div>
                <div className="text-sm text-slate-500">-</div>
                <div className="text-sm text-slate-500">Me</div>
                <div className="text-sm text-slate-500">{new Date(p.createdAt).toLocaleDateString()}</div>
                <div className="text-sm text-slate-500">EN</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Modal */}
      <CreateProjectModal
        isOpen={modalOpen}
        initialTab={selectedTab}
        onClose={() => setModalOpen(false)}
      />
    </div>
  )
}

export default function ProjectsPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading projects...</div>}>
      <ProjectsContent />
    </Suspense>
  )
}
