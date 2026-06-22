"use client"

import React, { useState } from "react"
import { MonitorPlay, MessageSquare, Video, FilePlus, X, Trash2, ChevronDown, Edit2, Check, AlertCircle, Filter, Columns, AlignJustify, Maximize, MoreVertical, MoreHorizontal } from "lucide-react"
import { useRouter } from "next/navigation"
import CreateProjectModal, { ModalTabId } from "@/components/CreateProjectModal/CreateProjectModal"
import { useSourceProjectStore } from "@/lib/sourceProjectStore"

const DROPDOWN_ITEMS: { type: ModalTabId; label: string; icon: any; color: string }[] = [
  { type: "file", label: "Presentation", icon: MonitorPlay, color: "text-blue-600" },
  { type: "ai", label: "AI Chat Avatar", icon: MessageSquare, color: "text-emerald-600" },
  { type: "video", label: "Video Presentation", icon: Video, color: "text-violet-600" },
  { type: "scratch", label: "Quick Start", icon: FilePlus, color: "text-slate-600" },
]

export default function SourceProjectsPage() {
  const router = useRouter()
  const { projects, addProject, deleteProject } = useSourceProjectStore()
  
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedTab, setSelectedTab] = useState<ModalTabId>("file")
  const [projectToDelete, setProjectToDelete] = useState<{id: string, name: string} | null>(null)

  const openWizard = (tabId: ModalTabId) => {
    setSelectedTab(tabId)
    setModalOpen(true)
  }

  return (
    <div className="px-8 py-8 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-lg font-bold text-slate-800">Source Projects</h1>
        
        {/* Create Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              const el = document.getElementById('create-dropdown-source');
              if (el) el.classList.toggle('hidden');
            }}
            className="bg-[#0066FF] hover:bg-blue-600 text-white text-xs font-medium py-2 px-4 rounded transition-colors uppercase tracking-wide flex items-center gap-2"
          >
            CREATE PROJECT <ChevronDown size={14} />
          </button>
          
          <div id="create-dropdown-source" className="hidden absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-100 py-2 z-10 animate-in fade-in slide-in-from-top-2 duration-150">
            {DROPDOWN_ITEMS.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.type}
                  onClick={() => {
                    const el = document.getElementById('create-dropdown-source');
                    if (el) el.classList.add('hidden');
                    openWizard(item.type);
                  }}
                  className="w-full text-left px-4 py-2.5 hover:bg-slate-50 transition-colors flex items-center gap-3 text-[15px] font-medium text-slate-700"
                >
                  <Icon size={18} className={item.color} />
                  {item.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>


      {/* Table Toolbar & Pagination */}
      <div className="flex flex-col gap-2 mb-2">
        <div className="flex justify-end gap-4 text-slate-500">
          <button className="hover:text-slate-800 transition-colors p-1"><Filter size={16} /></button>
          <button className="hover:text-slate-800 transition-colors p-1"><Columns size={16} /></button>
          <button className="hover:text-slate-800 transition-colors p-1"><AlignJustify size={16} /></button>
          <button className="hover:text-slate-800 transition-colors p-1"><Maximize size={16} /></button>
        </div>
        <div className="flex justify-end items-center text-[13px] text-slate-600 gap-4">
          <div className="flex items-center gap-2">
            <span>Rows per page</span>
            <select className="bg-transparent focus:outline-none cursor-pointer text-slate-800 border-none">
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-slate-800">1-{projects.length} of {projects.length}</span>
            <div className="flex items-center gap-1 text-slate-400">
              <button className="hover:text-slate-600 disabled:opacity-50 p-1" disabled>&lt;</button>
              <button className="hover:text-slate-600 disabled:opacity-50 p-1" disabled>&gt;</button>
            </div>
          </div>
        </div>
      </div>

      {/* List of existing source projects */}
      <div className="w-full">
        {projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400 bg-white">
            <div className="p-8 text-center text-slate-500 text-sm">No source projects created yet.</div>
          </div>
        ) : (
          <div className="w-full border-t-[4px] border-[#0066FF]">
            <table className="w-full border-collapse text-[13px] bg-white border-b border-slate-100">
              <thead>
                <tr className="border-b border-slate-100 text-slate-700">
                  <th className="text-left px-5 py-4 font-bold">
                    <div className="flex items-center justify-between">Name <MoreVertical size={14} className="text-slate-300"/></div>
                  </th>
                  <th className="text-left px-5 py-4 font-bold">
                    <div className="flex items-center justify-between">Type <MoreVertical size={14} className="text-slate-300"/></div>
                  </th>
                  <th className="text-left px-5 py-4 font-bold">
                    <div className="flex items-center justify-between">Created <MoreVertical size={14} className="text-slate-300"/></div>
                  </th>
                  <th className="text-center px-5 py-4 font-bold w-24">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {projects.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="px-5 py-3 font-medium text-slate-900">
                      {p.name}
                    </td>
                    <td className="px-5 py-3 text-slate-500">
                      <span className="bg-slate-100 px-2.5 py-0.5 rounded-full text-xs">{p.type}</span>
                    </td>
                    <td className="px-5 py-3 text-slate-500">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4 text-center">
                      <button className="text-slate-400 hover:text-slate-600 p-1 rounded-md transition-colors inline-flex justify-center w-full">
                        <MoreHorizontal size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Modal */}
      <CreateProjectModal
        isOpen={modalOpen}
        initialTab={selectedTab}
        onClose={() => setModalOpen(false)}
      />
      
      {/* Delete Confirmation Modal */}
      {projectToDelete && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setProjectToDelete(null)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                  <AlertCircle size={20} className="text-red-600" />
                </div>
                <h2 className="text-lg font-bold text-slate-900">Delete Project</h2>
              </div>
              <p className="text-sm text-slate-600 mb-1">
                Are you sure you want to delete the <span className="font-semibold text-slate-900">{projectToDelete.name}</span> project?
              </p>
              <p className="text-sm text-slate-600">
                Any templates linked to it may lose their source content.
              </p>
            </div>
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setProjectToDelete(null)}
                className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 hover:bg-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteProject(projectToDelete.id)
                  setProjectToDelete(null)
                }}
                className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-semibold shadow-sm transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
