"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutTemplate, Settings, Users, Plug, Briefcase, 
  ChevronDown, ChevronUp, MonitorPlay, HelpCircle, 
  Palette, Image as ImageIcon, Activity, Flag, Tag, 
  Database, Send, Navigation
} from "lucide-react"
import { useState } from "react"

const NAV_ITEMS = [
  { label: "Companies", href: "#", icon: Briefcase },
  { label: "Source Projects", href: "/source-projects", icon: MonitorPlay },
  { label: "Users", href: "#", icon: Users },
  { 
    label: "Additional tools", 
    icon: Navigation,
    subItems: [
      { label: "Avatar Roles", href: "#", icon: Activity },
      { label: "Voices", href: "#", icon: Activity },
    ]
  },
  { label: "Project Templates", href: "/project-templates", icon: LayoutTemplate },
  { label: "Product Types", href: "#", icon: Tag },
  { label: "Slide Theme", href: "#", icon: Palette },
  { label: "Log Table", href: "#", icon: Database },
  { label: "Goals", href: "#", icon: Flag },
  { label: "Settings", href: "#", icon: Settings },
  { label: "Themes", href: "#", icon: Palette },
  { label: "Discounts", href: "#", icon: Tag },
  { label: "Avatar Images", href: "#", icon: ImageIcon },
  { label: "Integrations", href: "#", icon: Plug },
  { label: "Help", href: "#", icon: HelpCircle },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const [isToolsOpen, setIsToolsOpen] = useState(false)

  return (
    <aside className="w-[260px] shrink-0 bg-white border-r border-slate-100 flex flex-col h-screen sticky top-0 overflow-hidden">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-6 py-5 shrink-0">
        <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 3L19 12L5 21V3Z" />
          </svg>
        </div>
        <div>
          <span className="font-bold text-slate-800 text-sm leading-none block">Pitch</span>
          <span className="font-bold text-slate-800 text-sm leading-none block">Avatar</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-4 py-2 flex flex-col gap-1 custom-scrollbar">
        {NAV_ITEMS.map((item) => {
          if (item.subItems) {
            return (
              <div key={item.label} className="flex flex-col">
                <button
                  onClick={() => setIsToolsOpen(!isToolsOpen)}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded text-[13px] font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={16} className="text-slate-400" />
                    {item.label}
                  </div>
                  {isToolsOpen ? <ChevronUp size={14} className="text-slate-400" /> : <ChevronDown size={14} className="text-slate-400" />}
                </button>
                
                {isToolsOpen && (
                  <div className="flex flex-col gap-1 mt-1 pl-4">
                    {item.subItems.map((sub) => (
                      <Link
                        key={sub.label}
                        href={sub.href}
                        className="flex items-center gap-3 px-3 py-2 rounded text-[13px] font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                      >
                        <sub.icon size={14} className="text-slate-400" />
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )
          }

          const isActive = item.href !== "#" && pathname.startsWith(item.href)

          return (
            <Link
              key={item.label}
              href={item.href}
              className={[
                "flex items-center gap-3 px-3 py-2.5 rounded text-[13px] font-medium transition-colors",
                isActive
                  ? "bg-blue-50 text-blue-600"
                  : "text-slate-700 hover:bg-slate-50",
              ].join(" ")}
            >
              <item.icon size={16} className={isActive ? "text-blue-600" : "text-slate-400"} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Footer Area */}
      <div className="px-5 pb-6 pt-4 shrink-0 bg-white">
        <div className="text-center mb-3">
          <p className="text-[13px] text-slate-700 font-medium">Presentations <span className="text-slate-500 font-normal">0 of 9999999</span></p>
        </div>
        <div className="w-full h-px bg-slate-200 mb-4"></div>
        <button className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg border border-blue-200 text-blue-600 text-sm font-medium hover:bg-blue-50 transition-colors">
          Request Demo
          <Send size={14} className="text-blue-400" />
        </button>
      </div>
    </aside>
  )
}
