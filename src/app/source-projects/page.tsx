"use client"

import React, { useState } from "react"
import { MonitorPlay, MessageSquare, Video, FilePlus, X, Trash2, ChevronDown, Edit2, Check, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { useSourceProjectStore } from "@/lib/sourceProjectStore"

const WIZARDS = [
  {
    type: "Presentation",
    label: "Presentation",
    desc: "Build an interactive presentation",
    icon: MonitorPlay,
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-100",
    hover: "hover:border-blue-300",
  },
  {
    type: "AI Chat-avatar",
    label: "AI Chat Avatar",
    desc: "Create an AI-powered chat avatar",
    icon: MessageSquare,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-100",
    hover: "hover:border-emerald-300",
  },
  {
    type: "Video project",
    label: "Video Presentation",
    desc: "Create a video presentation",
    icon: Video,
    color: "text-violet-600",
    bg: "bg-violet-50",
    border: "border-violet-100",
    hover: "hover:border-violet-300",
  },
  {
    type: "Blank slide",
    label: "Quick Start",
    desc: "Start with a blank slide",
    icon: FilePlus,
    color: "text-slate-600",
    bg: "bg-slate-50",
    border: "border-slate-200",
    hover: "hover:border-slate-300",
  },
]


export default function SourceProjectsPage() {
  const router = useRouter()
  const { projects, addProject, deleteProject } = useSourceProjectStore()
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedType, setSelectedType] = useState(WIZARDS[0])
  const [projectName, setProjectName] = useState("")
  const [projectToDelete, setProjectToDelete] = useState<{id: string, name: string} | null>(null)

  const openWizard = (wizard: typeof WIZARDS[0]) => {
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
    <div className="px-8 py-8 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Source Projects</h1>
          <p className="text-sm text-slate-500 mt-1">Create the underlying master projects that templates will link to.</p>
        </div>
        
        {/* Create Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              const el = document.getElementById('create-dropdown-source');
              if (el) el.classList.toggle('hidden');
            }}
            className="bg-[#0066FF] hover:bg-blue-600 text-white font-semibold py-2.5 px-5 rounded-lg transition-colors shadow-sm flex items-center gap-2 text-sm"
          >
            Create project
          </button>
          
          <div id="create-dropdown-source" className="hidden absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-100 py-2 z-10 animate-in fade-in slide-in-from-top-2 duration-150">
            {WIZARDS.map((w) => {
              const Icon = w.icon
              return (
                <button
                  key={w.type}
                  onClick={() => {
                    const el = document.getElementById('create-dropdown-source');
                    if (el) el.classList.add('hidden');
                    openWizard(w);
                  }}
                  className="w-full text-left px-4 py-2.5 hover:bg-slate-50 transition-colors flex items-center gap-3 text-sm font-medium text-slate-700"
                >
                  <Icon size={16} className={w.color} />
                  {w.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>


      {/* List of existing source projects */}
      <div>
        <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wide mb-4">
          Available Source Projects ({projects.length})
        </h2>
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          {projects.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-sm">No source projects created yet.</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider text-left">
                <tr>
                  <th className="px-5 py-3 font-semibold">Name</th>
                  <th className="px-5 py-3 font-semibold">Type</th>
                  <th className="px-5 py-3 font-semibold">Created</th>
                  <th className="px-5 py-3 font-semibold w-20">Actions</th>
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
                    <td className="px-5 py-3 flex gap-2">
                      <button
                        onClick={() => router.push(`/editor/${p.id}`)}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                        title="Edit source project"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => setProjectToDelete({ id: p.id, name: p.name })}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        title="Delete source project"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Create Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setModalOpen(false)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <selectedType.icon size={18} className={selectedType.color} />
                Create {selectedType.type}
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
