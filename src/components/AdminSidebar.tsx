"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutTemplate, Settings, Users, Plug, BarChart2, Briefcase, Folder, ChevronDown, ChevronUp, MonitorPlay, UserPlus, Film } from "lucide-react"
import { useState } from "react"

const NAV_ITEMS = [
  {
    section: "CONTENT",
    items: [
      { 
        label: "Projects", 
        icon: Folder, 
        subItems: [
          { label: "Presentations", href: "/projects?type=presentation", icon: MonitorPlay },
          { label: "AI Chat-avatar", href: "/projects?type=avatar", icon: UserPlus },
          { label: "Video", href: "/projects?type=video", icon: Film },
        ]
      },
      { label: "Project Templates", href: "/", icon: LayoutTemplate },
      { label: "Source Projects", href: "/source-projects", icon: Briefcase },
    ],
  },
  {
    section: "SYSTEM",
    items: [
      { label: "Integrations", href: "/integrations", icon: Plug },
      { label: "Settings", href: "/settings", icon: Settings },
    ],
  },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const [isProjectsOpen, setIsProjectsOpen] = useState(true)

  return (
    <aside className="w-60 shrink-0 bg-white border-r border-slate-200 flex flex-col min-h-screen sticky top-0 h-screen overflow-y-auto">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-slate-100">
        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-sm">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="5 3 19 12 5 21 5 3"/>
          </svg>
        </div>
        <div>
          <span className="font-bold text-slate-900 text-sm leading-none block">Pitch Avatar</span>
          <span className="text-xs text-slate-500 leading-none mt-0.5 block">Admin Panel</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-5">
        {NAV_ITEMS.map(({ section, items }) => (
          <div key={section}>
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest px-2 mb-1.5">{section}</p>
            <ul className="flex flex-col gap-0.5">
              {items.map((item) => {
                const isProjects = item.label === "Projects"
                const isActive = item.href ? pathname === item.href : isProjects && pathname.startsWith("/projects")

                return (
                  <li key={item.label}>
                    {isProjects ? (
                      <div className="flex flex-col">
                        <button
                          onClick={() => setIsProjectsOpen(!isProjectsOpen)}
                          className={[
                            "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-semibold transition-colors",
                            isActive || isProjectsOpen
                              ? "bg-indigo-50 text-indigo-600"
                              : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                          ].join(" ")}
                        >
                          <div className="flex items-center gap-2.5">
                            <item.icon size={18} className={isActive || isProjectsOpen ? "text-indigo-600" : "text-slate-400"} />
                            {item.label}
                          </div>
                          {isProjectsOpen ? <ChevronUp size={16} className="text-indigo-500" /> : <ChevronDown size={16} className="text-slate-400" />}
                        </button>
                        
                        {/* Subitems */}
                        {isProjectsOpen && item.subItems && (
                          <ul className="flex flex-col gap-0.5 mt-1 ml-4 border-l border-slate-100 pl-2">
                            {item.subItems.map((sub) => (
                              <li key={sub.label}>
                                <Link
                                  href={sub.href}
                                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                                >
                                  <sub.icon size={16} className="text-slate-400" />
                                  {sub.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ) : (
                      <Link
                        href={item.href!}
                        className={[
                          "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                          isActive
                            ? "bg-indigo-50 text-indigo-700"
                            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                        ].join(" ")}
                      >
                        <item.icon size={16} className={isActive ? "text-indigo-600" : "text-slate-400"} />
                        {item.label}
                      </Link>
                    )}
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-slate-100">
        <p className="text-xs text-slate-400">© 2026 Pitch Avatar</p>
      </div>
    </aside>
  )
}
