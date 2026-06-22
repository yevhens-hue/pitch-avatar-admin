"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  Briefcase, Presentation, Contact, List, Sparkles, 
  Podcast, LayoutTemplate, GitBranch, CloudUpload, 
  Target, Settings, Rocket, BadgePercent, Image as ImageIcon, 
  TerminalSquare, HelpCircle, ChevronDown, ChevronUp, Send, Menu 
} from "lucide-react"
import { useState } from "react"

const NAV_ITEMS = [
  { label: "Companies", href: "#", icon: Briefcase },
  { label: "All presentations", href: "/source-projects", icon: Presentation },
  { label: "Users", href: "#", icon: Contact },
  { 
    label: "Resource hub", 
    icon: List,
    subItems: [
      { label: "Avatar roles", href: "#", icon: Sparkles },
      { label: "Voices", href: "#", icon: Podcast },
    ]
  },
  { label: "Presentation templates", href: "/project-templates", icon: LayoutTemplate },
  { label: "Product type", href: "#", icon: GitBranch },
  { label: "Slide topic", href: "#", icon: GitBranch },
  { label: "Logs table", href: "#", icon: CloudUpload },
  { label: "Goals", href: "#", icon: Target },
  { label: "Settings", href: "#", icon: Settings },
  { label: "Topics", href: "#", icon: Rocket },
  { label: "Discounts", href: "#", icon: BadgePercent },
  { label: "Avatar Images", href: "#", icon: ImageIcon },
  { separator: true },
  { label: "Integrations", href: "#", icon: TerminalSquare },
  { label: "Help", href: "#", icon: HelpCircle },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const [isToolsOpen, setIsToolsOpen] = useState(false)

  return (
    <aside className="w-[260px] shrink-0 bg-white border-r border-slate-100 flex flex-col h-screen sticky top-0 overflow-hidden">
      {/* Logo */}
      <div className="flex items-center gap-4 px-6 py-6 shrink-0">
        <Menu size={20} className="text-slate-500 cursor-pointer" />
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-[#0066FF] rounded-md flex items-center justify-center rounded-tr-none rounded-bl-none rounded-tl-xl rounded-br-xl rotate-45">
            <div className="w-2 h-2 bg-white rounded-full -rotate-45"></div>
          </div>
          <div>
            <span className="font-bold text-slate-800 text-[15px] leading-none block tracking-tight">Pitch</span>
            <span className="font-bold text-slate-800 text-[15px] leading-none block tracking-tight">Avatar</span>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-2 flex flex-col gap-1 custom-scrollbar">
        {NAV_ITEMS.map((item, i) => {
          if (item.separator) {
            return <div key={`sep-${i}`} className="w-full h-px bg-slate-100 my-3"></div>
          }

          if (item.subItems) {
            return (
              <div key={item.label} className="flex flex-col">
                <button
                  onClick={() => setIsToolsOpen(!isToolsOpen)}
                  className="w-full flex items-center justify-between px-3 py-3 rounded-lg text-[14px] font-semibold text-slate-800 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3.5">
                    <item.icon size={18} className="text-slate-600" strokeWidth={1.5} />
                    {item.label}
                  </div>
                  {isToolsOpen ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                </button>
                
                {isToolsOpen && (
                  <div className="flex flex-col gap-1 mt-1 pl-5">
                    {item.subItems.map((sub) => (
                      <Link
                        key={sub.label}
                        href={sub.href}
                        className="flex items-center gap-3.5 px-3 py-2.5 rounded-lg text-[14px] font-semibold text-slate-800 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                      >
                        <sub.icon size={16} className="text-slate-600" strokeWidth={1.5} />
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
              href={item.href!}
              className={[
                "flex items-center gap-3.5 px-3 py-3 rounded-lg text-[14px] font-semibold transition-colors",
                isActive
                  ? "bg-[#F0F5FF] text-slate-900"
                  : "text-slate-800 hover:bg-slate-50",
              ].join(" ")}
            >
              <item.icon size={18} className={isActive ? "text-[#0066FF]" : "text-slate-600"} strokeWidth={isActive ? 2 : 1.5} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Footer Area */}
      <div className="px-5 pb-6 pt-4 shrink-0 bg-white">
        <div className="text-center mb-3">
          <p className="text-[14px] text-slate-800 font-semibold">Presentations <span className="text-slate-600 font-medium">0 of 9999999</span></p>
        </div>
        <div className="w-full h-px bg-slate-200 mb-4"></div>
        <button className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg border border-blue-200 text-blue-600 text-sm font-medium hover:bg-blue-50 transition-colors">
          Request demo
          <Send size={14} className="text-blue-400" />
        </button>
      </div>
    </aside>
  )
}
