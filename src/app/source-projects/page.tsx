"use client"

import React, { useState, useEffect } from "react"
import { Settings, Trash2, AlertCircle, Filter, Columns, AlignJustify, Maximize, Plus, X, Home, Image as ImageIcon, MoreHorizontal, Edit3, Copy } from "lucide-react"
import { useTemplateStore } from "@/lib/templateStore"
import { useSourceProjectStore } from "@/lib/sourceProjectStore"
import { PresentationTemplate } from "@/data/presentation-templates"

const CATEGORY_OPTIONS = [
  "HR", "Internal Communications", "Marketing", "Sales", "Support", 
  "Compliance", "IT Security", "Research", "Recruiter", "Partnerships", "Investor Relations"
]

export default function AddTemplatesPage() {
  const { templates, fetchTemplates, addTemplate, updateTemplate, deleteTemplate } = useTemplateStore()
  const { projects: sourceProjects, fetchProjects } = useSourceProjectStore()
  
  const [showModal, setShowModal] = useState(false)
  const [editingPT, setEditingPT] = useState<PresentationTemplate | null>(null)
  const [form, setForm] = useState({ 
    name: "", 
    description: "", 
    selectedProjectId: "", 
    status: "active",
    productType: "HR",
    tags: "",
    isOnHomepage: true,
    order: ""
  })
  const [templateToDelete, setTemplateToDelete] = useState<PresentationTemplate | null>(null)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

  useEffect(() => {
    fetchTemplates()
    fetchProjects()
  }, [fetchTemplates, fetchProjects])

  const openCreate = () => {
    setEditingPT(null)
    setForm({ 
      name: "", 
      description: "", 
      selectedProjectId: sourceProjects[0]?.id || "", 
      status: "active",
      productType: "HR",
      tags: "",
      isOnHomepage: true,
      order: ""
    })
    setShowModal(true)
  }

  const openEdit = (pt: PresentationTemplate) => {
    setEditingPT(pt)
    setForm({
      name: pt.name,
      description: pt.description || "",
      selectedProjectId: pt.selectedProjectId || sourceProjects[0]?.id || "",
      status: pt.accessType === "inactive" ? "inactive" : "active",
      productType: pt.productTypes?.[0] || "HR",
      tags: pt.tags?.join(", ") || "",
      isOnHomepage: pt.isOnHomepage !== false,
      order: pt.order ? String(pt.order) : ""
    })
    setShowModal(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const tagsArray = form.tags.split(",").map(t => t.trim()).filter(Boolean)
    const orderNum = form.order ? parseInt(form.order, 10) : undefined

    if (editingPT) {
      await updateTemplate(editingPT.id, {
        name: form.name,
        description: form.description,
        selectedProjectId: form.selectedProjectId,
        accessType: form.status as any,
        productTypes: [form.productType],
        tags: tagsArray,
        isOnHomepage: form.isOnHomepage,
        order: orderNum
      })
    } else {
      const nextOrder = orderNum || (templates.length > 0 ? Math.max(...templates.map(t => t.order || 0)) + 1 : 1)
      await addTemplate({
        id: "",
        createdAt: "",
        name: form.name,
        description: form.description,
        selectedProjectId: form.selectedProjectId,
        accessType: form.status as any,
        isOnHomepage: form.isOnHomepage,
        order: nextOrder,
        templateType: "copy",
        productTypes: [form.productType],
        projectType: "Presentation + AI Avatar",
        tags: tagsArray,
        slideCount: 8,
      })
    }
    setShowModal(false)
  }

  const handleCopy = async (pt: PresentationTemplate) => {
    const nextOrder = templates.length > 0 ? Math.max(...templates.map(t => t.order || 0)) + 1 : 1
    const { id, createdAt, ...rest } = pt
    await addTemplate({
      ...rest,
      id: "",
      createdAt: "",
      name: `${pt.name} (Copy)`,
      order: nextOrder
    } as PresentationTemplate)
  }

  const isActive = (pt: PresentationTemplate) => pt.accessType !== "inactive"

  return (
    <div className="px-8 py-8 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-lg font-bold text-slate-800">Add Templates</h1>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--main-blue)] text-white rounded text-xs font-medium hover:bg-[var(--hover-blue)] transition-colors uppercase tracking-wide"
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
            <span>Rows per page</span>
            <select className="bg-transparent focus:outline-none cursor-pointer text-slate-800 border-none">
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
          <div className="flex flex-col items-center justify-center py-20 text-slate-400 bg-white border-b-[4px] border-[var(--main-blue)]">
            <div className="text-5xl mb-4">📋</div>
            <p className="text-base font-medium text-slate-600">No templates yet</p>
            <p className="text-sm mt-1">Click "ADD TEMPLATE" to get started</p>
          </div>
        ) : (
          <div className="w-full bg-white border-b-[4px] border-[var(--main-blue)] pb-2">
            <table className="w-full border-collapse text-[13px]">
              <thead>
                <tr className="text-slate-700">
                  <th className="text-left px-5 py-3 font-bold w-16"></th>
                  <th className="text-left px-5 py-3 font-bold">
                    <div className="flex items-center gap-1">Name <MoreVertical size={14} className="text-slate-300"/></div>
                  </th>
                  <th className="text-left px-5 py-3 font-bold">
                    <div className="flex items-center gap-1">Source Project <MoreVertical size={14} className="text-slate-300"/></div>
                  </th>
                  <th className="text-left px-5 py-3 font-bold">
                    <div className="flex items-center gap-1">Tags <MoreVertical size={14} className="text-slate-300"/></div>
                  </th>
                  <th className="text-left px-5 py-3 font-bold">
                    <div className="flex items-center gap-1">Homepage <MoreVertical size={14} className="text-slate-300"/></div>
                  </th>
                  <th className="text-left px-5 py-3 font-bold w-28">
                    <div className="flex items-center gap-1">Status <MoreVertical size={14} className="text-slate-300"/></div>
                  </th>
                  <th className="text-center px-5 py-3 font-bold w-24">Actions</th>
                </tr>
              </thead>
              <tbody>
                {templates.map((pt) => {
                  const active = isActive(pt)
                  const sourceProjectName = sourceProjects.find(sp => sp.id === pt.selectedProjectId)?.name || pt.selectedProjectId || "Not set"
                  return (
                    <tr key={pt.id} className="hover:bg-slate-50 transition-colors border-none">
                      <td className="px-5 py-3">
                        <div className="w-14 h-9 rounded-md bg-[var(--ai-purple)] flex items-center justify-center shadow-sm">
                          <ImageIcon size={16} className="text-white opacity-80" />
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <p className="font-semibold text-slate-900">{pt.name}</p>
                        {pt.description && (
                          <p className="text-xs text-slate-500 mt-0.5 max-w-sm truncate">{pt.description}</p>
                        )}
                      </td>
                      <td className="px-5 py-3 text-slate-600 text-[13px] max-w-[150px]">
                        {sourceProjectName}
                      </td>
                      <td className="px-5 py-3">
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
                      <td className="px-5 py-3">
                        {pt.isOnHomepage && (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[var(--tag-purple-bg)] text-[var(--ai-blue)] rounded-full text-[12px] font-semibold">
                            <Home size={12} />
                            <span>#{pt.order || "-"}</span>
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-3">
                        <span className={[
                          "inline-block px-3 py-1 rounded-full text-[12px] font-bold tracking-wide",
                          active ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500",
                        ].join(" ")}>
                          {active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-center relative">
                        <button 
                          className={`p-1 rounded-md transition-colors inline-flex justify-center w-full ${activeDropdown === pt.id ? 'bg-slate-100 text-slate-800' : 'text-slate-400 hover:text-slate-600'}`}
                          onClick={() => setActiveDropdown(activeDropdown === pt.id ? null : pt.id)}
                        >
                          <MoreHorizontal size={18} />
                        </button>
                        
                        {activeDropdown === pt.id && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={() => setActiveDropdown(null)}></div>
                            <div className="absolute right-8 top-10 w-36 bg-white rounded-lg shadow-lg border border-slate-100 py-1 z-20 animate-in fade-in zoom-in-95 duration-100 text-left">
                              <button 
                                className="w-full text-left px-4 py-2 hover:bg-slate-50 text-[13px] text-slate-700 flex items-center gap-2 transition-colors"
                                onClick={() => {
                                  openEdit(pt)
                                  setActiveDropdown(null)
                                }}
                              >
                                <Edit3 size={14} className="text-slate-400" /> Edit
                              </button>
                              <button 
                                className="w-full text-left px-4 py-2 hover:bg-slate-50 text-[13px] text-slate-700 flex items-center gap-2 transition-colors"
                                onClick={() => {
                                  handleCopy(pt)
                                  setActiveDropdown(null)
                                }}
                              >
                                <Copy size={14} className="text-slate-400" /> Copy
                              </button>
                              <button 
                                className="w-full text-left px-4 py-2 hover:bg-red-50 text-[13px] text-red-600 flex items-center gap-2 transition-colors"
                                onClick={() => {
                                  setTemplateToDelete(pt)
                                  setActiveDropdown(null)
                                }}
                              >
                                <Trash2 size={14} className="text-red-400" /> Delete
                              </button>
                            </div>
                          </>
                        )}
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
            <form onSubmit={handleSave} className="px-6 pb-6 flex flex-col gap-6 max-h-[80vh] overflow-y-auto">
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

              <div className="flex flex-col gap-2.5">
                <label className="text-[15px] font-medium text-slate-900">Tags (comma separated)</label>
                <input
                  type="text"
                  value={form.tags}
                  onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
                  placeholder="e.g. Sales, Pitch, Internal"
                  className="px-4 py-3 rounded-xl border border-slate-300 text-[15px] focus:outline-none focus:border-[#5C7CFA] focus:ring-1 focus:ring-[#5C7CFA] transition-all"
                />
              </div>
              <div className="flex gap-4">
                <div className="flex flex-col gap-2.5 flex-1">
                  <label className="text-[15px] font-medium text-slate-900">Homepage Visibility</label>
                  <label className="flex items-center gap-2 mt-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.isOnHomepage}
                      onChange={e => setForm(f => ({ ...f, isOnHomepage: e.target.checked }))}
                      className="w-5 h-5 text-[#5C7CFA] rounded border-slate-300 focus:ring-[#5C7CFA]"
                    />
                    <span className="text-[15px] text-slate-700">Show on homepage</span>
                  </label>
                </div>
                <div className="flex flex-col gap-2.5 flex-1">
                  <label className="text-[15px] font-medium text-slate-900">Home Order</label>
                  <input
                    type="number"
                    value={form.order}
                    onChange={e => setForm(f => ({ ...f, order: e.target.value }))}
                    placeholder="e.g. 1"
                    className="px-4 py-3 rounded-xl border border-slate-300 text-[15px] focus:outline-none focus:border-[#5C7CFA] focus:ring-1 focus:ring-[#5C7CFA] transition-all disabled:opacity-50 disabled:bg-slate-50"
                    disabled={!form.isOnHomepage}
                  />
                </div>
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
