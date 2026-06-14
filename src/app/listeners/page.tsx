'use client'

import React, { useState, useEffect } from 'react'
import { Search, Headphones } from 'lucide-react'
import { supabase } from '../../lib/supabase'

export default function ListenersPage() {
  const [listeners, setListeners] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const loadListeners = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('listeners')
        .select(`
          id, first_name, last_name, email, position, company, created_at,
          enrollments(id, status)
        `)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching listeners:', error)
      } else {
        setListeners(data || [])
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadListeners()
  }, [])

  const filtered = listeners.filter(l => {
    const name = [l.first_name, l.last_name].filter(Boolean).join(' ').toLowerCase()
    const q = search.toLowerCase()
    return name.includes(q) || (l.email || '').toLowerCase().includes(q)
  })

  return (
    <div className="max-w-[1100px] mx-auto p-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-indigo-100 rounded-xl text-indigo-600">
          <Headphones size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold m-0 text-slate-900">Listeners</h1>
          <p className="m-0 text-slate-500 text-sm">
            {loading ? 'Загрузка...' : `${listeners.length} слушателей в системе`}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6 flex gap-4">
        <div className="relative flex-1 max-w-[320px]">
          <Search size={16} className="absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Поиск по имени или email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full py-2.5 pl-10 pr-4 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-indigo-400"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Имя</th>
              <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</th>
              <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Должность / Компания</th>
              <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Всего Enrollments</th>
              <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Активных</th>
              <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Регистрация</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-500">Загрузка данных из Supabase...</td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-400">Ничего не найдено</td>
              </tr>
            ) : filtered.map(l => {
              const name = [l.first_name, l.last_name].filter(Boolean).join(' ') || '—'
              const total = l.enrollments?.length ?? 0
              const active = l.enrollments?.filter((e: any) => e.status === 'Pending' || e.status === 'In Progress').length ?? 0
              return (
                <tr key={l.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-medium text-slate-900">{name}</td>
                  <td className="p-4 text-slate-500 text-sm">{l.email || '—'}</td>
                  <td className="p-4 text-slate-600 text-sm">
                    {[l.position, l.company].filter(Boolean).join(' · ') || <span className="text-slate-300">—</span>}
                  </td>
                  <td className="p-4">
                    <span className="font-semibold text-slate-900 bg-slate-100 px-3 py-1 rounded-full text-sm">{total}</span>
                  </td>
                  <td className="p-4">
                    {active > 0
                      ? <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">{active} активных</span>
                      : <span className="text-slate-300 text-xs">—</span>
                    }
                  </td>
                  <td className="p-4 text-slate-400 text-xs">
                    {l.created_at ? new Date(l.created_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {!loading && filtered.length === 0 && search && (
          <div className="p-8 text-center text-slate-500">Ничего не найдено по запросу «{search}»</div>
        )}
      </div>
    </div>
  )
}
