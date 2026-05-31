"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"

export default function ProjectsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"my" | "shared">("my")

  return (
    <div className="px-8 py-8 w-full bg-slate-50 min-h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-extrabold text-[#0B132B]">My Projects</h1>
        <button
          onClick={() => router.push("/source-projects")}
          className="bg-[#0066FF] hover:bg-blue-600 text-white font-semibold py-2.5 px-5 rounded-lg transition-colors shadow-sm"
        >
          + Create Project
        </button>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Tabs and Toolbar */}
        <div className="flex items-center justify-between px-5 pt-3 border-b border-slate-100">
          {/* Tabs */}
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

          {/* Action Buttons */}
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

        {/* Empty State */}
        <div className="flex flex-col items-center justify-center py-32 bg-white">
          <p className="text-[#64748B] text-sm font-medium">No projects found.</p>
        </div>
      </div>
    </div>
  )
}
