"use client"

import React, { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { MonitorPlay, MessageSquare, Video, FilePlus, PlaySquare, Plus, X, ArrowRight } from "lucide-react"
import { useSourceProjectStore } from "@/lib/sourceProjectStore"
import CreateProjectModal, { ModalTabId } from "@/components/CreateProjectModal/CreateProjectModal"

const WIZARD_CARDS: { type: ModalTabId; label: string; desc: string; linkText: string; icon: any; color: string; bg: string; borderLeft: string }[] = [
  {
    type: "file",
    label: "Quick Presentation",
    desc: "Add AI avatar or voice to your slides",
    linkText: "MAKE SLIDES INTERACTIVE",
    icon: Video,
    color: "text-[#0ea5e9]",
    bg: "bg-[#0ea5e9]",
    borderLeft: "border-l-[#0ea5e9]",
  },
  {
    type: "video",
    label: "Video Presentation",
    desc: "Dub your video in any languages with AI",
    linkText: "ADD VOICE, AVATAR OR SUBTITLES",
    icon: PlaySquare,
    color: "text-[#a855f7]",
    bg: "bg-[#a855f7]",
    borderLeft: "border-l-[#a855f7]",
  },
  {
    type: "ai",
    label: "AI Chat Avatar",
    desc: "Set up conversational multilingual AI assistant",
    linkText: "GENERATE CHAT-AVATAR",
    icon: MessageSquare,
    color: "text-[#6366f1]",
    bg: "bg-[#6366f1]",
    borderLeft: "border-l-[#6366f1]",
  },
  {
    type: "scratch",
    label: "Create from scratch",
    desc: "Add AI avatars, texts or images",
    linkText: "START WITH BLANK SLIDE",
    icon: Plus,
    color: "text-[#f97316]",
    bg: "bg-[#f97316]",
    borderLeft: "border-l-[#f97316]",
  },
]

const DROPDOWN_ITEMS: { type: ModalTabId; label: string; icon: any }[] = [
  { type: "file", label: "Presentation", icon: MonitorPlay },
  { type: "ai", label: "AI Chat-avatar", icon: MessageSquare },
  { type: "video", label: "Video project", icon: Video },
  { type: "scratch", label: "Start with blank slide", icon: FilePlus },
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
  const [selectedTab, setSelectedTab] = useState<ModalTabId>("file")

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

  const handleSelectWizard = (tabId: ModalTabId) => {
    setDropdownOpen(false)
    setSelectedTab(tabId)
    setModalOpen(true)
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
              {DROPDOWN_ITEMS.map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.type}
                    onClick={() => handleSelectWizard(item.type)}
                    className="w-full text-left px-4 py-2.5 hover:bg-slate-50 transition-colors flex items-center gap-3 text-[15px] font-medium text-slate-700"
                  >
                    <Icon size={18} className="text-slate-600" />
                    {item.label}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Project Wizards Grid */}
      <div className="mb-10">
        <h2 className="text-[17px] font-bold text-[#0B132B] mb-5">Project Wizards</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {WIZARD_CARDS.map((card) => {
            const Icon = card.icon
            return (
              <div 
                key={card.type}
                onClick={() => handleSelectWizard(card.type)}
                className={`bg-white rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_20px_-8px_rgba(0,0,0,0.15)] transition-all cursor-pointer border border-slate-100 border-l-4 ${card.borderLeft} flex flex-col p-6 h-full`}
              >
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-5 text-white ${card.bg}`}>
                  <Icon size={20} strokeWidth={2.5} />
                </div>
                <h3 className="text-lg font-bold text-[#0B132B] mb-2">{card.label}</h3>
                <p className="text-sm text-slate-500 mb-6 flex-grow leading-relaxed">{card.desc}</p>
                <div className={`text-[11px] font-bold tracking-wider flex items-center gap-1.5 uppercase ${card.color}`}>
                  {card.linkText} <ArrowRight size={14} />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Main Card (Table) */}
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
          <div className="flex flex-col items-center justify-center py-24 bg-white">
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
      <CreateProjectModal
        isOpen={modalOpen}
        initialTab={selectedTab}
        onClose={() => setModalOpen(false)}
      />
    </div>
  )
}
