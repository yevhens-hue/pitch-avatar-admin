"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutTemplate, Settings, Users, Plug, BarChart2, Briefcase } from "lucide-react"

const NAV_ITEMS = [
  {
    section: "CONTENT",
    items: [
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
              {items.map(({ label, href, icon: Icon }) => {
                const isActive = pathname === href
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      className={[
                        "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                        isActive
                          ? "bg-indigo-50 text-indigo-700"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                      ].join(" ")}
                    >
                      <Icon size={16} className={isActive ? "text-indigo-600" : "text-slate-400"} />
                      {label}
                    </Link>
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
