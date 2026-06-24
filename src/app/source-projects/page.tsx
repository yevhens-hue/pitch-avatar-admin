"use client"

import React, { useState, useEffect } from "react"
import { Settings, Trash2, AlertCircle, Filter, Columns, AlignJustify, Maximize, Plus, X, Home, Image as ImageIcon } from "lucide-react"
import { useTemplateStore } from "@/lib/templateStore"
import { useSourceProjectStore } from "@/lib/sourceProjectStore"
import { PresentationTemplate } from "@/data/presentation-templates"

export default function AddTemplatesPage() {
  const { templates, fetchTemplates, addTemplate, updateTemplate, deleteTemplate } = useTemplateStore()
  const { projects: sourceProjects, fetchProjects } = useSourceProjectStore()
  
  const [showModal, setShowModal] = useState(false)
  const [editingPT, setEditingPT] = useState<PresentationTemplate | null>(null)
  const [form, setForm] = useState({ name: "", description: "", selectedProjectId: "", status: "active" })
  const [templateToDelete, setTemplateToDelete] = useState<PresentationTemplate | null>(null)

  useEffect(() => {
    fetchTemplates()
    fetchProjects()
  }, [fetchTemplates, fetchProjects])

  const openCreate = () => {
    setEditingPT(null)
    setForm({ name: "", description: "", selectedProjectId: sourceProjects[0]?.id || "", status: "active" })
    setShowModal(true)
  }

  const openEdit = (pt: PresentationTemplate) => {
    setEditingPT(pt)
    setForm({
      name: pt.name,
      description: pt.description || "",
      selectedProjectId: pt.selectedProjectId || sourceProjects[0]?.id || "",
      status: pt.accessType === "inactive" ? "inactive" : "active"
    })
    setShowModal(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (editingPT) {
      await updateTemplate(editingPT.id, {
        name: form.name,
        description: form.description,
        selectedProjectId: form.selectedProjectId,
        accessType: form.status as any,
      })
    } else {
      const nextOrder = templates.length > 0 ? Math.max(...templates.map(t => t.order || 0)) + 1 : 1
      await addTemplate({
        id: "",
        createdAt: "",
        name: form.name,
        description: form.description,
        selectedProjectId: form.selectedProjectId,
        accessType: form.status as any,
        isOnHomepage: true,
        order: nextOrder,
        templateType: "copy",
        productTypes: ["General"],
        projectType: "Presentation + AI Avatar",
        tags: [],
        slideCount: 8,
      })
    }
    setShowModal(false)
  }

  const isActive = (pt: PresentationTemplate) => pt.accessType !== "inactive"

  return (
    <div className="px-8 py-8 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-lg font-bold text-slate-800">Add Templates</h1>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#0066FF] hover:bg-blue-600 text-white rounded text-xs font-medium transition-colors uppercase tracking-wide"
        >
          ADD TEMPLATE <Plus size={14} />
        </button>
      </div>

      <div className="flex flex-col gap-2 mb-2">
        <div className="flex justify-end gap-4 text-slate-500">
          <button className="hover:text-slate-800 transition-colors p-1"><Filter size={16} /></button>
          <button className="hover:text-slate-800 transition-colors p-1"><Columns size={16} /></button>
          <button className="hover:text-slate-800 transition-colors p-1"><AlignJustify size={16} /></button>
          <button className="hover:text-slate-800 transition-colors p-1"><Maximize size={16} /></button>
        </div>
        <div className="flex justify-end items-center text-[13px] text-slate-600 gap-4">
          <div className="flex items-center gap-2">
            <span>Rows</span>
            <select className="bg-transparent focus:outline-none cursor-pointer text-slate-800 border border-slate-200 rounded px-1 py-0.5">
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-slate-800">1-{templates.length} of {templates.length}</span>
            <div className="flex items-center gap-1 text-slate-400">
              <button className="hover:text-slate-600 disabled:opacity-50 p-1" disabled>&lt;</button>
              <button className="hover:text-slate-600 disabled:opacity-50 p-1" disabled>&gt;</button>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full">
        {templates.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400 bg-white border-b-[4px] border-[#0066FF]">
            <div className="p-8 text-center text-slate-500 text-sm">No templates added yet.</div>
          </div>
        ) : (
          <div className="w-full bg-white border border-slate-200 border-b-[4px] border-b-[#0066FF] pb-2 rounded-t-lg overflow-hidden">
            <table className="w-full border-collapse text-[13px]">
              <thead>
                <tr className="text-slate-500 border-b border-slate-200 bg-white">
                  <th className="w-16"></th>
                  <th className="text-left px-4 py-4 font-semibold text-slate-800">Name</th>
                  <th className="text-left px-4 py-4 font-semibold text-slate-800">Source Project</th>
                  <th className="text-left px-4 py-4 font-semibold text-slate-800">Tags</th>
                  <th className="text-left px-4 py-4 font-semibold text-slate-800">Homepage</th>
                  <th className="text-left px-4 py-4 font-semibold text-slate-800 w-28">Status</th>
                  <th className="text-center px-4 py-4 font-semibold text-slate-800 w-20">Actions</th>
                </tr>
              </thead>
              <tbody>
                {templates.map((pt) => {
                  const active = isActive(pt)
                  const sourceProjectName = sourceProjects.find(sp => sp.id === pt.selectedProjectId)?.name || pt.selectedProjectId || "Not set"
                  return (
                    <tr key={pt.id} className="hover:bg-slate-50 transition-colors border-b border-slate-100 bg-white">
                      <td className="px-4 py-4 w-16">
                        <div className="w-12 h-10 rounded-md bg-[#645CFA] flex items-center justify-center shadow-sm ml-2">
                          <ImageIcon size={16} className="text-white opacity-80" />
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <p className="font-bold text-slate-800 text-[14px]">{pt.name}</p>
                        {pt.description && (
                          <p className="text-[13px] text-slate-500 mt-1 max-w-md truncate">{pt.description}</p>
                        )}
                      </td>
                      <td className="px-4 py-4 text-slate-600 text-[13px] max-w-[150px]">
                        {sourceProjectName}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-wrap gap-1.5">
                          {pt.tags && pt.tags.length > 0 ? (
                            pt.tags.map(tag => (
                              <span key={tag} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[11px] font-medium">
                                {tag}
                              </span>
                            ))
                          ) : (
                            <span className="text-slate-400 italic text-[13px]">No tags</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        {pt.isOnHomepage && (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#F0F5FF] text-[#5C7CFA] rounded-full text-[12px] font-semibold">
                            <Home size={12} />
                            <span>#{pt.order || "-"}</span>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <span className={[
                          "inline-block px-3 py-1 rounded-full text-[12px] font-bold tracking-wide",
                          active ? "bg-[#E6F8F3] text-[#00B078]" : "bg-slate-100 text-slate-500",
                        ].join(" ")}>
                          {active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button 
                            className="text-slate-500 hover:text-slate-800 p-1.5 transition-colors"
                            onClick={() => openEdit(pt)}
                          >
                            <Settings size={18} />
                          </button>
                          <button 
                            className="text-slate-500 hover:text-red-600 p-1.5 transition-colors"
                            onClick={() => setTemplateToDelete(pt)}
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-5">
              <h2 className="text-[19px] font-bold text-slate-900 tracking-tight">
                {editingPT ? "Edit Template" : "New Template"}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-700 transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSave} className="px-6 pb-6 flex flex-col gap-6">
              <div className="flex flex-col gap-2.5">
                <label className="text-[15px] font-medium text-slate-900">Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="px-4 py-3 rounded-xl border border-slate-300 text-[15px] focus:outline-none focus:border-[#5C7CFA] focus:ring-1 focus:ring-[#5C7CFA] transition-all"
                  required
                />
              </div>
              <div className="flex flex-col gap-2.5">
                <label className="text-[15px] font-medium text-slate-900">Description</label>
                <input
                  type="text"
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  className="px-4 py-3 rounded-xl border border-slate-300 text-[15px] focus:outline-none focus:border-[#5C7CFA] focus:ring-1 focus:ring-[#5C7CFA] transition-all"
                />
              </div>
              <div className="flex flex-col gap-2.5">
                <label className="text-[15px] font-medium text-slate-900">Source Project</label>
                <select
                  value={form.selectedProjectId}
                  onChange={e => setForm(f => ({ ...f, selectedProjectId: e.target.value }))}
                  className="px-4 py-3 rounded-xl border border-slate-300 text-[15px] bg-white focus:outline-none focus:border-[#5C7CFA] focus:ring-1 focus:ring-[#5C7CFA] transition-all"
                  required
                >
                  <option value="" disabled>Select project...</option>
                  {sourceProjects.map(proj => (
                    <option key={proj.id} value={proj.id}>{proj.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-2.5">
                <label className="text-[15px] font-medium text-slate-900">Status</label>
                <select
                  value={form.status}
                  onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                  className="px-4 py-3 rounded-xl border border-slate-300 text-[15px] bg-white focus:outline-none focus:border-[#5C7CFA] focus:ring-1 focus:ring-[#5C7CFA] transition-all"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2.5 rounded-xl border border-slate-200 text-[15px] font-medium text-slate-800 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#5C7CFA] hover:bg-[#4B6CE3] text-white text-[15px] font-medium transition-colors"
                >
                  {editingPT ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {templateToDelete && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center z-50 p-4" onClick={() => setTemplateToDelete(null)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                  <AlertCircle size={20} className="text-red-600" />
                </div>
                <h2 className="text-[19px] font-bold text-slate-900 tracking-tight">Delete Template</h2>
              </div>
              <p className="text-[15px] text-slate-600 mb-1">
                Are you sure you want to delete the <span className="font-semibold text-slate-900">{templateToDelete.name}</span> template?
              </p>
            </div>
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setTemplateToDelete(null)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-[15px] font-medium text-slate-800 hover:bg-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteTemplate(templateToDelete.id)
                  setTemplateToDelete(null)
                }}
                className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-[15px] font-medium transition-colors shadow-sm"
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
