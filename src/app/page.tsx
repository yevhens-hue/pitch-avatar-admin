"use client"

import React, { useState, useEffect, useRef } from "react"
import { Plus, Edit3, Trash2, X, Home, Upload, FileJson, AlertCircle, Copy, Sparkles } from "lucide-react"
import { PresentationTemplate } from "@/data/presentation-templates"
import { useTemplateStore } from "@/lib/templateStore"
import { useSourceProjectStore } from "@/lib/sourceProjectStore"

const COVER_GRADIENTS = [
  "linear-gradient(135deg,#6366f1 0%,#4f46e5 100%)",
  "linear-gradient(135deg,#0ea5e9 0%,#0284c7 100%)",
  "linear-gradient(135deg,#a855f7 0%,#7c3aed 100%)",
  "linear-gradient(135deg,#f97316 0%,#ea580c 100%)",
  "linear-gradient(135deg,#10b981 0%,#059669 100%)",
  "linear-gradient(135deg,#f43f5e 0%,#e11d48 100%)",
  "linear-gradient(135deg,#14b8a6 0%,#0d9488 100%)",
  "linear-gradient(135deg,#8b5cf6 0%,#6d28d9 100%)",
  "linear-gradient(135deg,#f59e0b 0%,#d97706 100%)",
  "linear-gradient(135deg,#06b6d4 0%,#0891b2 100%)",
]

const CATEGORY_EMOJI: Record<string, string> = {
  HR: "👥",
  "Internal Communications": "📣",
  Marketing: "🚀",
  Sales: "💼",
  Support: "🎧",
  Compliance: "⚖️",
  "IT Security": "🔐",
  Research: "🔍",
  Recruiter: "🤝",
  Partnerships: "🤝",
  "Investor Relations": "📊",
}

const PRODUCT_TYPES = [
  "General", "Sales", "HR", "Marketing", "Support",
  "Compliance", "IT Security", "Research", "Recruiter",
  "Partnerships", "Internal Communications", "Investor Relations",
]



type Status = "active" | "inactive"
type TemplateType = "copy" | "generate"

interface FormState {
  name: string
  description: string
  selectedProjectId: string
  status: Status
  isOnHomepage: boolean
  order: number
  templateType: TemplateType
  productType: string
  slideCount: number
  tags: string
}

const emptyForm = (nextOrder: number, defaultSourceProject: string): FormState => ({
  name: "",
  description: "",
  selectedProjectId: defaultSourceProject,
  status: "active",
  isOnHomepage: true,
  order: nextOrder,
  templateType: "copy",
  productType: "General",
  slideCount: 8,
  tags: "",
})

function isActive(pt: PresentationTemplate): boolean {
  return pt.accessType !== "inactive"
}

interface ImportPreview {
  templates: Partial<PresentationTemplate>[]
  fileName: string
  error?: string
}

export default function TemplatesPage() {
  const { templates, addTemplate, updateTemplate, deleteTemplate, fetchTemplates } = useTemplateStore()
  const { projects: sourceProjects } = useSourceProjectStore()
  const defaultSourceProject = sourceProjects[0]?.name || ""

  const [showModal, setShowModal] = useState(false)
  const [editingPT, setEditingPT] = useState<PresentationTemplate | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm(1, defaultSourceProject))
  const [importPreview, setImportPreview] = useState<ImportPreview | null>(null)
  const [importStatus, setImportStatus] = useState<"idle" | "importing" | "done" | "error">("idle")
  const [importMessage, setImportMessage] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchTemplates()
  }, [fetchTemplates])

  const nextOrder = templates.length > 0
    ? Math.max(...templates.map(t => t.order || 0)) + 1
    : 1

  const openCreate = () => {
    setEditingPT(null)
    setForm(emptyForm(nextOrder, defaultSourceProject))
    setShowModal(true)
  }

  const openEdit = (pt: PresentationTemplate) => {
    setEditingPT(pt)
    setForm({
      name: pt.name,
      description: pt.description,
      selectedProjectId: pt.selectedProjectId || defaultSourceProject,
      status: isActive(pt) ? "active" : "inactive",
      isOnHomepage: pt.isOnHomepage !== false,
      order: pt.order || 1,
      templateType: pt.templateType || "copy",
      productType: pt.productTypes?.[0] || "General",
      slideCount: pt.slideCount || 8,
      tags: (pt.tags || []).join(", "),
    })
    setShowModal(true)
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    const payload: Omit<PresentationTemplate, "id" | "createdAt"> = {
      name: form.name,
      description: form.description,
      selectedProjectId: form.templateType === "copy" ? form.selectedProjectId : undefined,
      accessType: form.status === "active" ? ("system" as const) : ("inactive" as const),
      isOnHomepage: form.isOnHomepage,
      order: Number(form.order),
      templateType: form.templateType,
      productTypes: [form.productType],
      projectType: "Presentation + AI Avatar",
      tags: form.tags ? form.tags.split(",").map(t => t.trim()).filter(Boolean) : [],
      slideCount: Number(form.slideCount),
    }
    if (editingPT) {
      updateTemplate(editingPT.id, payload as Partial<PresentationTemplate>)
    } else {
      addTemplate({ id: "", createdAt: "", ...payload })
    }
    setShowModal(false)
  }

  // ── JSON Import ──────────────────────────────────────────────────────────────
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const raw = JSON.parse(ev.target?.result as string)
        const arr: Partial<PresentationTemplate>[] = Array.isArray(raw) ? raw : [raw]
        if (!arr.every(t => typeof t === "object" && t !== null)) {
          throw new Error("Invalid format: expected an object or array of objects.")
        }
        setImportPreview({ templates: arr, fileName: file.name })
        setImportStatus("idle")
        setImportMessage("")
      } catch (err) {
        setImportPreview({ templates: [], fileName: file.name, error: (err as Error).message })
      }
    }
    reader.readAsText(file)
    e.target.value = ""
  }

  const handleImportConfirm = async () => {
    if (!importPreview || importPreview.error) return
    setImportStatus("importing")
    let count = 0
    for (const tpl of importPreview.templates) {
      try {
        await addTemplate({
          id: "",
          createdAt: "",
          name: tpl.name || "Untitled Template",
          description: tpl.description || "",
          productTypes: tpl.productTypes || ["General"],
          projectType: tpl.projectType || "Presentation + AI Avatar",
          tags: tpl.tags || [],
          slideCount: tpl.slideCount || 8,
          templateType: tpl.templateType || "copy",
          accessType: tpl.accessType || "system",
          selectedProjectId: tpl.selectedProjectId,
          isOnHomepage: tpl.isOnHomepage ?? true,
          order: tpl.order ?? nextOrder + count,
          badge: tpl.badge,
        })
        count++
      } catch {
        // continue with next
      }
    }
    setImportStatus("done")
    setImportMessage(`${count} template${count !== 1 ? "s" : ""} imported successfully.`)
  }

  const closeImport = () => {
    setImportPreview(null)
    setImportStatus("idle")
    setImportMessage("")
  }

  const homepageTemplates = templates
    .filter(t => t.isOnHomepage !== false && isActive(t))
    .sort((a, b) => (a.order || 0) - (b.order || 0))

  return (
    <div className="px-8 py-8 max-w-6xl">
      {/* ── Page header ── */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Project Templates</h1>
          <p className="text-sm text-slate-500 mt-1">Select existing projects to use as templates</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 bg-white text-slate-700 rounded-lg text-sm font-medium shadow-sm hover:bg-slate-50 transition-colors"
            aria-label="Import templates from JSON"
          >
            <Upload size={15} />
            Import JSON
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            className="hidden"
            onChange={handleFileSelect}
            aria-label="Select JSON file"
          />
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold shadow-sm hover:bg-indigo-700 transition-colors"
          >
            <Plus size={15} />
            Add Template
          </button>
        </div>
      </div>

      {/* ── Homepage summary ── */}
      {homepageTemplates.length > 0 && (
        <div className="mb-5 flex items-center gap-2 text-xs text-slate-500 bg-indigo-50 border border-indigo-100 rounded-lg px-4 py-2.5">
          <Home size={13} className="text-indigo-400" />
          <span>
            <strong className="text-indigo-700">{homepageTemplates.length}</strong>{" "}
            template{homepageTemplates.length !== 1 ? "s" : ""} visible on Home Page —&nbsp;
            {homepageTemplates.map(t => t.name).join(", ")}
          </span>
        </div>
      )}

      {/* ── Import preview banner ── */}
      {importPreview && (
        <div className={[
          "mb-5 border rounded-xl p-4",
          importPreview.error ? "bg-red-50 border-red-200" : "bg-emerald-50 border-emerald-200",
        ].join(" ")}>
          <div className="flex items-start gap-3">
            {importPreview.error
              ? <AlertCircle size={18} className="text-red-500 mt-0.5 shrink-0" />
              : <FileJson size={18} className="text-emerald-600 mt-0.5 shrink-0" />
            }
            <div className="flex-1 min-w-0">
              <p className={["text-sm font-semibold", importPreview.error ? "text-red-700" : "text-emerald-800"].join(" ")}>
                {importPreview.error
                  ? `Parse error in "${importPreview.fileName}"`
                  : `Ready to import ${importPreview.templates.length} template${importPreview.templates.length !== 1 ? "s" : ""} from "${importPreview.fileName}"`
                }
              </p>
              {importPreview.error
                ? <p className="text-xs text-red-600 mt-1">{importPreview.error}</p>
                : (
                  <ul className="mt-2 flex flex-wrap gap-1.5">
                    {importPreview.templates.slice(0, 6).map((t, i) => (
                      <li key={i} className="text-xs bg-white border border-emerald-200 text-emerald-700 rounded-full px-2.5 py-0.5">
                        {t.name || "Untitled"}
                      </li>
                    ))}
                    {importPreview.templates.length > 6 && (
                      <li className="text-xs text-emerald-600 px-1 py-0.5">
                        +{importPreview.templates.length - 6} more
                      </li>
                    )}
                  </ul>
                )
              }
              {importStatus === "done" && (
                <p className="text-xs text-emerald-700 font-medium mt-2">✅ {importMessage}</p>
              )}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {!importPreview.error && importStatus !== "done" && (
                <button
                  type="button"
                  onClick={handleImportConfirm}
                  disabled={importStatus === "importing"}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 disabled:opacity-60 transition-colors"
                >
                  {importStatus === "importing" ? "Importing…" : "Confirm Import"}
                </button>
              )}
              <button
                type="button"
                onClick={closeImport}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-white/60 transition-colors"
                aria-label="Dismiss"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Table ── */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        {templates.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <div className="text-5xl mb-4">📋</div>
            <p className="text-base font-medium text-slate-600">No templates yet</p>
            <p className="text-sm mt-1">Click "+ Add Template" or "Import JSON" to get started</p>
          </div>
        ) : (
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-20">Thumbnail</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Name</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Source Project</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-24">Homepage</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-24">Status</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-24">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {templates.map((pt, idx) => {
                const gradient = COVER_GRADIENTS[Number(pt.id) - 1] ?? COVER_GRADIENTS[idx % COVER_GRADIENTS.length]
                const emoji = CATEGORY_EMOJI[pt.productTypes?.[0]] ?? "📋"
                const active = isActive(pt)
                const onHome = pt.isOnHomepage !== false && active
                return (
                  <tr key={pt.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-4">
                      <div
                        style={{ background: gradient }}
                        className="w-14 h-9 rounded-md flex items-center justify-center text-base shadow-sm"
                      >
                        {emoji}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-slate-900">{pt.name}</p>
                        {pt.templateType === "generate" && (
                          <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-violet-600 bg-violet-50 border border-violet-200 rounded-full px-2 py-0.5">
                            <Sparkles size={9} /> AI
                          </span>
                        )}
                      </div>
                      {pt.description && (
                        <p className="text-xs text-slate-500 mt-0.5 max-w-sm truncate">{pt.description}</p>
                      )}
                    </td>
                    <td className="px-5 py-4 text-slate-600 text-sm">
                      {pt.templateType === "generate"
                        ? <span className="inline-flex items-center gap-1 text-xs text-violet-600"><Sparkles size={11} /> From scratch</span>
                        : pt.selectedProjectId || <span className="text-slate-400 italic">Not set</span>
                      }
                    </td>
                    <td className="px-5 py-4">
                      {onHome ? (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full">
                          <Home size={10} /> #{pt.order || "—"}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400">Hidden</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span className={[
                        "inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold",
                        active ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500",
                      ].join(" ")}>
                        {active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => openEdit(pt)}
                          className="p-1.5 rounded-md text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                          aria-label={`Edit ${pt.name}`}
                          title="Edit"
                        >
                          <Edit3 size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => { if (confirm(`Delete "${pt.name}"?`)) deleteTemplate(pt.id) }}
                          className="p-1.5 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          aria-label={`Delete ${pt.name}`}
                          title="Delete"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      {templates.length > 0 && (
        <p className="text-xs text-slate-400 mt-3 px-1">
          {templates.length} template{templates.length !== 1 ? "s" : ""} total
        </p>
      )}

      {/* ── Create / Edit Modal ── */}
      {showModal && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900">
                {editingPT ? "Edit Template" : "New Project Template"}
              </h2>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="px-6 py-5 flex flex-col gap-5">

              {/* ── Template Type toggle ── */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                  Template Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setForm(f => ({ ...f, templateType: "copy" }))}
                    className={[
                      "flex flex-col items-center gap-1.5 px-3 py-3 rounded-xl border-2 text-sm font-medium transition-all",
                      form.templateType === "copy"
                        ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300",
                    ].join(" ")}
                    aria-pressed={form.templateType === "copy"}
                  >
                    <Copy size={18} />
                    <span className="text-xs">Copy from Project</span>
                    <span className="text-[10px] text-slate-400 font-normal text-center leading-tight">Duplicates an existing project</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm(f => ({ ...f, templateType: "generate" }))}
                    className={[
                      "flex flex-col items-center gap-1.5 px-3 py-3 rounded-xl border-2 text-sm font-medium transition-all",
                      form.templateType === "generate"
                        ? "border-violet-500 bg-violet-50 text-violet-700"
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300",
                    ].join(" ")}
                    aria-pressed={form.templateType === "generate"}
                  >
                    <Sparkles size={18} />
                    <span className="text-xs">Create from Scratch</span>
                    <span className="text-[10px] text-slate-400 font-normal text-center leading-tight">AI generates a new project</span>
                  </button>
                </div>
              </div>

              {/* Name */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="tpl-name" className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                  Template Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="tpl-name"
                  required
                  type="text"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. B2B Sales Prospecting"
                  className="px-3 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition"
                />
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="tpl-desc" className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                  Description
                </label>
                <textarea
                  id="tpl-desc"
                  rows={2}
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="Short description of what this template is for…"
                  className="px-3 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-900 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition font-[inherit]"
                />
              </div>

              {/* Source Project — copy mode only */}
              {form.templateType === "copy" && (
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="tpl-project" className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                    Source Project <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="tpl-project"
                    value={form.selectedProjectId}
                    onChange={e => setForm(f => ({ ...f, selectedProjectId: e.target.value }))}
                    className="px-3 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition"
                  >
                    {sourceProjects.map(proj => (
                      <option key={proj.id} value={proj.name}>{proj.name}</option>
                    ))}
                  </select>
                  <p className="text-xs text-slate-400">
                    When a user clicks "Use Template", this project will be duplicated.
                  </p>
                </div>
              )}

              {/* Category — generate mode only */}
              {form.templateType === "generate" && (
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="tpl-category" className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                    Category
                  </label>
                  <select
                    id="tpl-category"
                    value={form.productType}
                    onChange={e => setForm(f => ({ ...f, productType: e.target.value }))}
                    className="px-3 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400 transition"
                  >
                    {PRODUCT_TYPES.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Tags */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="tpl-tags" className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                  Tags <span className="text-slate-400 font-normal normal-case">(comma-separated)</span>
                </label>
                <input
                  id="tpl-tags"
                  type="text"
                  value={form.tags}
                  onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
                  placeholder="e.g. sales, enterprise, outbound"
                  className="px-3 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition"
                />
              </div>

              {/* Status + Order + Slides */}
              <div className="flex gap-3">
                <div className="flex-1 flex flex-col gap-1.5">
                  <label htmlFor="tpl-status" className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Status</label>
                  <select
                    id="tpl-status"
                    value={form.status}
                    onChange={e => setForm(f => ({ ...f, status: e.target.value as Status }))}
                    className="px-3 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300 transition"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div className="flex-1 flex flex-col gap-1.5">
                  <label htmlFor="tpl-order" className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Home Order</label>
                  <input
                    id="tpl-order"
                    type="number"
                    min={1}
                    value={form.order}
                    onChange={e => setForm(f => ({ ...f, order: Number(e.target.value) }))}
                    className="px-3 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition"
                  />
                </div>
                <div className="flex-1 flex flex-col gap-1.5">
                  <label htmlFor="tpl-slides" className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Slides</label>
                  <input
                    id="tpl-slides"
                    type="number"
                    min={1}
                    value={form.slideCount}
                    onChange={e => setForm(f => ({ ...f, slideCount: Number(e.target.value) }))}
                    className="px-3 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition"
                  />
                </div>
              </div>

              {/* Show on homepage */}
              <label className={[
                "flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-colors",
                form.isOnHomepage ? "border-indigo-200 bg-indigo-50" : "border-slate-200 bg-white",
              ].join(" ")}>
                <input
                  type="checkbox"
                  checked={form.isOnHomepage}
                  onChange={e => setForm(f => ({ ...f, isOnHomepage: e.target.checked }))}
                  className="w-4 h-4 accent-indigo-600 cursor-pointer"
                  aria-label="Show on Home Page"
                />
                <span className="text-sm font-medium text-slate-700">Show on Home Page</span>
              </label>

              {/* Warning */}
              <div className="flex gap-2.5 bg-amber-50 border border-amber-200 px-4 py-3 rounded-xl">
                <span className="text-base leading-none mt-0.5">⚠️</span>
                <p className="text-xs text-amber-700 font-medium leading-relaxed">
                  PowerPoint files with animations are not currently supported.
                </p>
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={[
                    "px-5 py-2 rounded-lg text-white text-sm font-semibold shadow-sm transition-colors",
                    form.templateType === "generate"
                      ? "bg-violet-600 hover:bg-violet-700"
                      : "bg-indigo-600 hover:bg-indigo-700",
                  ].join(" ")}
                >
                  {editingPT ? "Update" : form.templateType === "generate" ? "Create from Scratch" : "Create Template"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
