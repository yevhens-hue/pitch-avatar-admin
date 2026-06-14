'use client'

import React, { useState, useEffect } from 'react'
import { Search, ClipboardList } from 'lucide-react'
import { supabase } from '../../lib/supabase'

const STATUS_STYLES: Record<string, string> = {
  Pending:       'bg-yellow-50 text-yellow-700 border-yellow-200',
  'In Progress': 'bg-blue-50 text-blue-700 border-blue-200',
  Completed:     'bg-emerald-50 text-emerald-700 border-emerald-200',
  Failed:        'bg-red-50 text-red-700 border-red-200',
}

export default function EnrollmentsPage() {
  const [enrollments, setEnrollments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const loadEnrollments = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('enrollments')
        .select(`
          id, title, status, target_type, created_at, start_date, expires_at,
          listeners(first_name, last_name, email),
          projects(title),
          groups(name)
        `)
        .order('created_at', { ascending: false })
        .limit(300)

      if (error) {
        console.error('Error fetching enrollments:', error)
      } else {
        setEnrollments(data || [])
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadEnrollments()
  }, [])

  const filtered = enrollments.filter(e => {
    const q = search.toLowerCase()
    const matchesSearch = (e.title || '').toLowerCase().includes(q) ||
      (e.listeners?.email || '').toLowerCase().includes(q) ||
      [e.listeners?.first_name, e.listeners?.last_name].filter(Boolean).join(' ').toLowerCase().includes(q)
    const matchesStatus = statusFilter === 'all' || e.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const counts = {
    total: enrollments.length,
    pending: enrollments.filter(e => e.status === 'Pending').length,
    inProgress: enrollments.filter(e => e.status === 'In Progress').length,
    completed: enrollments.filter(e => e.status === 'Completed').length,
    failed: enrollments.filter(e => e.status === 'Failed').length,
  }

  return (
    <div className="max-w-[1200px] mx-auto p-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-indigo-100 rounded-xl text-indigo-600">
          <ClipboardList size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold m-0 text-slate-900">Enrollments</h1>
          <p className="m-0 text-slate-500 text-sm">
            {loading ? 'Загрузка...' : `${enrollments.length} энролментов в системе`}
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-5 gap-3 mb-6">
        {[
          { label: 'Всего', value: counts.total, status: 'all', color: 'bg-slate-50 border-slate-200 text-slate-700' },
          { label: 'Pending', value: counts.pending, status: 'Pending', color: 'bg-yellow-50 border-yellow-200 text-yellow-700' },
          { label: 'In Progress', value: counts.inProgress, status: 'In Progress', color: 'bg-blue-50 border-blue-200 text-blue-700' },
          { label: 'Completed', value: counts.completed, status: 'Completed', color: 'bg-emerald-50 border-emerald-200 text-emerald-700' },
          { label: 'Failed', value: counts.failed, status: 'Failed', color: 'bg-red-50 border-red-200 text-red-700' },
        ].map(card => (
          <button
            key={card.label}
            onClick={() => setStatusFilter(statusFilter === card.status ? 'all' : card.status)}
            className={`rounded-xl border px-4 py-3 text-left transition-all ${card.color} ${statusFilter === card.status ? 'ring-2 ring-indigo-400 ring-offset-1' : 'hover:opacity-80'}`}
          >
            <div className="text-2xl font-bold">{card.value}</div>
            <div className="text-xs font-medium mt-0.5 opacity-80">{card.label}</div>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="mb-6 flex gap-4">
        <div className="relative flex-1 max-w-[320px]">
          <Search size={16} className="absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Поиск по заголовку или listener..."
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
              <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Заголовок</th>
              <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Статус</th>
              <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Тип</th>
              <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Listener / Группа</th>
              <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Проект</th>
              <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Создан</th>
              <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Истекает</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-slate-500">Загрузка данных из Supabase...</td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-slate-400">Ничего не найдено</td>
              </tr>
            ) : filtered.map(e => {
              const listenerName = e.listeners
                ? [e.listeners.first_name, e.listeners.last_name].filter(Boolean).join(' ') || e.listeners.email
                : e.groups?.name || 'Anonymous'
              const statusStyle = STATUS_STYLES[e.status] || 'bg-slate-100 text-slate-600 border-slate-200'
              const isExpired = e.expires_at && new Date(e.expires_at) < new Date()

              return (
                <tr key={e.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-medium text-slate-900 max-w-[200px]">
                    <span className="block truncate">{e.title || '—'}</span>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${statusStyle}`}>
                      {e.status}
                    </span>
                  </td>
                  <td className="p-4 text-slate-500 capitalize text-xs">{e.target_type || '—'}</td>
                  <td className="p-4 text-slate-700 text-sm">{listenerName}</td>
                  <td className="p-4 text-slate-500 text-sm max-w-[160px]">
                    <span className="block truncate">{e.projects?.title || '—'}</span>
                  </td>
                  <td className="p-4 text-slate-400 text-xs whitespace-nowrap">
                    {e.created_at ? new Date(e.created_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                  </td>
                  <td className="p-4 text-xs whitespace-nowrap">
                    {e.expires_at
                      ? <span className={isExpired ? 'text-red-500 font-medium' : 'text-slate-400'}>
                          {new Date(e.expires_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' })}
                          {isExpired && ' ⚠'}
                        </span>
                      : <span className="text-slate-300">—</span>
                    }
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {!loading && (
        <p className="mt-3 text-xs text-slate-400 text-right">
          Показано {filtered.length} из {enrollments.length} enrollments
        </p>
      )}
    </div>
  )
}
