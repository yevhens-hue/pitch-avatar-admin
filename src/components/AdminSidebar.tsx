"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  Briefcase, Presentation, Contact, List, Sparkles, 
  Podcast, LayoutTemplate, GitBranch, CloudUpload, 
  Target, Settings, Rocket, BadgePercent, Image as ImageIcon, 
  TerminalSquare, HelpCircle, ChevronDown, ChevronUp, Send, Menu, MonitorPlay
} from "lucide-react"
import { useState } from "react"

type NavItem = {
  label?: string
  href?: string
  icon?: React.ElementType
  separator?: boolean
  subItems?: { label: string, href?: string, icon?: React.ElementType }[]
}

const NAV_ITEMS: NavItem[] = [
  { label: "Companies", href: "#", icon: Briefcase },
  { label: "All presentations", href: "#", icon: Presentation },
  { label: "Users", href: "/users", icon: Contact },
  { 
    label: "Additional tools", 
    icon: List,
    subItems: [
      { label: "Triggers", href: "#" },
      { label: "Media data", href: "#" },
      { label: "Parameters", href: "#" },
      { label: "Additional content", href: "#" },
      { label: "Simple lama", href: "#" },
    ]
  },
  { label: "Avatar roles", href: "#", icon: Sparkles },
  { 
    label: "Voices", 
    icon: Podcast,
    subItems: [
      { label: "Voice cloning", href: "#" },
      { label: "Voiceovers", href: "#" },
    ]
  },
  { label: "Add Templates", href: "/source-projects", icon: MonitorPlay },
  { label: "Project Template", href: "/project-templates", icon: LayoutTemplate },
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
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({})

  const toggleMenu = (label: string) => {
    setOpenMenus((prev) => ({ ...prev, [label]: !prev[label] }))
  }

  return (
    <aside className="w-[260px] shrink-0 bg-white border-r border-slate-100 flex flex-col h-screen sticky top-0 overflow-hidden">
      {/* Logo */}
      <div className="flex items-center gap-4 px-6 py-6 shrink-0">
        <Menu size={20} className="text-slate-500 cursor-pointer" />
        <Link href="/" className="block">
          <img src="/logo.png" alt="Pitch Avatar" className="h-8 w-auto" />
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-2 flex flex-col gap-1 custom-scrollbar">
        {NAV_ITEMS.map((item, i) => {
          if (item.separator) {
            return <div key={`sep-${i}`} className="w-full h-px bg-slate-100 my-3"></div>
          }

          if (item.subItems) {
            const Icon = item.icon as React.ElementType
            const isOpen = openMenus[item.label!] || false
            
            return (
              <div key={item.label} className="flex flex-col">
                <button
                  onClick={() => toggleMenu(item.label!)}
                  className="w-full flex items-center justify-between px-3 py-3 rounded-lg text-[14px] font-semibold text-slate-800 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3.5">
                    <Icon size={18} className="text-slate-600" strokeWidth={1.5} />
                    {item.label}
                  </div>
                  {isOpen ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                </button>
                
                {isOpen && (
                  <div className="flex flex-col gap-1 mt-1 pl-5">
                    {item.subItems.map((sub) => {
                      const SubIcon = sub.icon ? (sub.icon as React.ElementType) : null
                      return (
                        <Link
                          key={sub.label}
                          href={sub.href || "#"}
                          className="flex items-center gap-3.5 px-3 py-2.5 rounded-lg text-[14px] font-semibold text-slate-800 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                        >
                          {SubIcon && <SubIcon size={16} className="text-slate-600" strokeWidth={1.5} />}
                          <span className={!SubIcon ? "pl-[30px]" : ""}>{sub.label}</span>
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          }

          const isActive = item.href && item.href !== "#" && pathname.startsWith(item.href)
          const Icon = item.icon as React.ElementType

          return (
            <Link
              key={item.label}
              href={item.href || "#"}
              className={[
                "flex items-center gap-3.5 px-3 py-3 rounded-lg text-[14px] font-semibold transition-colors",
                isActive
                  ? "bg-[#F0F5FF] text-slate-900"
                  : "text-slate-800 hover:bg-slate-50",
              ].join(" ")}
            >
              <Icon size={18} className={isActive ? "text-[#0066FF]" : "text-slate-600"} strokeWidth={isActive ? 2 : 1.5} />
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
