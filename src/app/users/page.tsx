'use client'

import React, { useState, useEffect } from 'react'
import { Search, UserCog, Edit3, Eye, EyeOff } from 'lucide-react'
import { supabase } from '../../lib/supabase'

// Custom Floating Label Components
const FloatingInput = ({ label, value, onChange, type = 'text', required = false, rightIcon = null }: any) => {
  return (
    <div className="relative mb-6">
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder=" "
        className="block px-3 pb-3 pt-3 w-full text-gray-900 bg-transparent rounded-md border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-gray-500 peer"
      />
      <label className="absolute text-sm text-gray-500 bg-white px-1 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] left-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-1 peer-focus:scale-75 peer-focus:-translate-y-4">
        {label}{required && '*'}
      </label>
      {rightIcon && (
        <div className="absolute right-3 top-3 text-gray-500">
          {rightIcon}
        </div>
      )}
    </div>
  )
}

const FloatingSelect = ({ label, value, onChange, options, required = false }: any) => {
  return (
    <div className="relative mb-6">
      <select
        value={value}
        onChange={onChange}
        className="block px-3 pb-3 pt-3 w-full text-gray-900 bg-transparent rounded-md border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-gray-500 peer"
      >
        <option value="" disabled></option>
        {options.map((opt: any) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      <label className="absolute text-sm text-gray-500 bg-white px-1 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] left-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-1 peer-focus:scale-75 peer-focus:-translate-y-4">
        {label}{required && '*'}
      </label>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
      </div>
    </div>
  )
}

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editingUserId, setEditingUserId] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  // Form State
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    hubspotEmail: '',
    password: '',
    company: '',
    companyRole: '',
    tariff: 'Enterprise',
    listenersSeats: 100, // The new field
    language: 'English',
    removeAccess: false,
  })

  const loadUsers = async () => {
    setLoading(true)
    try {
      const { data: presenters, error: pError } = await supabase.from('presenters').select('*')
      const { data: seats, error: sError } = await supabase.from('listener_seats').select('*')
      
      if (pError) console.error('Error fetching presenters:', pError)
      if (sError) console.error('Error fetching listener seats:', sError)

      if (presenters) {
        const mergedUsers = presenters.map(p => {
          const seatData = (seats || []).find(s => s.user_id === p.id)
          return {
            id: p.id,
            name: `${p.first_name || ''} ${p.last_name || ''}`.trim() || 'No Name',
            email: p.email,
            maxSeats: seatData ? seatData.max_seats : 100,
            company: 'ROI4CIO', 
            tariff: 'Developer',
            language: 'Английский'
          }
        })
        setUsers(mergedUsers)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const handleEditClick = (user: any) => {
    setEditingUserId(user.id)
    setFormData({
      name: user.name,
      email: user.email,
      hubspotEmail: '',
      password: '',
      company: user.company || '',
      companyRole: 'Участник',
      tariff: user.tariff || 'Developer',
      listenersSeats: user.maxSeats || 100,
      language: user.language || 'Английский',
      removeAccess: false,
    })
  }

  const handleSave = async () => {
    if (!editingUserId) return;
    setSaving(true)
    try {
      // Upsert Listener Seats Quota
      const { data: existing } = await supabase
        .from('listener_seats')
        .select('id')
        .eq('user_id', editingUserId)
        .single()
        
      if (existing) {
        await supabase
          .from('listener_seats')
          .update({ max_seats: formData.listenersSeats })
          .eq('user_id', editingUserId)
      } else {
        await supabase
          .from('listener_seats')
          .insert({ user_id: editingUserId, max_seats: formData.listenersSeats, active_count: 0 })
      }

      await loadUsers()
      setEditingUserId(null)
    } catch (err) {
      console.error('Failed to save:', err)
      alert('Failed to save data to Supabase.')
    } finally {
      setSaving(false)
    }
  }

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  )

  if (editingUserId) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] py-10 flex justify-center">
        <div className="bg-white border border-gray-200 shadow-sm rounded-md w-full max-w-2xl p-8 pb-10 flex flex-col relative">
          
          <button 
            onClick={() => setEditingUserId(null)} 
            className="absolute top-4 right-6 text-gray-400 hover:text-gray-600 font-medium"
          >
            ✕ Закрыть
          </button>

          <h1 className="text-[22px] font-normal text-center text-gray-900 mb-8 mt-2">
            Создание/редактирование пользователя
          </h1>

          <div className="px-4">
            <FloatingInput
              label="Имя"
              required
              value={formData.name}
              onChange={(e: any) => setFormData({...formData, name: e.target.value})}
            />

            <FloatingInput
              label="Email"
              required
              value={formData.email}
              onChange={(e: any) => setFormData({...formData, email: e.target.value})}
            />

            <FloatingInput
              label="HubSpot Email"
              value={formData.hubspotEmail}
              onChange={(e: any) => setFormData({...formData, hubspotEmail: e.target.value})}
            />

            <FloatingInput
              label="password"
              required
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e: any) => setFormData({...formData, password: e.target.value})}
              rightIcon={
                <button type="button" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              }
            />

            <FloatingSelect
              label="company"
              required
              value={formData.company}
              onChange={(e: any) => setFormData({...formData, company: e.target.value})}
              options={[
                { value: 'Agiliway', label: 'Agiliway' },
                { value: 'TestQA', label: 'TestQA' },
                { value: 'ROI4CIO', label: 'ROI4CIO' },
              ]}
            />

            <FloatingInput
              label="Company Role"
              value={formData.companyRole}
              onChange={(e: any) => setFormData({...formData, companyRole: e.target.value})}
            />

            <div className="mb-6">
              <a href="#" className="text-[15px] text-[#4b0082] hover:underline" style={{textDecorationColor: '#4b0082'}}>
                Перейти к Администратору
              </a>
            </div>

            <FloatingSelect
              label="tariff"
              value={formData.tariff}
              onChange={(e: any) => setFormData({...formData, tariff: e.target.value})}
              options={[
                { value: 'Developer', label: 'Developer' },
                { value: 'Trial', label: 'Trial' },
                { value: 'Enterprise', label: 'Enterprise' },
              ]}
            />

            {/* INTEGRATION: ENROLLMENTS QUOTA SEATS */}
            <FloatingInput
              label="Listeners Seats (Enrollments Quota)"
              type="number"
              value={formData.listenersSeats}
              onChange={(e: any) => setFormData({...formData, listenersSeats: parseInt(e.target.value) || 0})}
            />

            <FloatingSelect
              label="language"
              value={formData.language}
              onChange={(e: any) => setFormData({...formData, language: e.target.value})}
              options={[
                { value: 'Английский', label: 'Английский' },
                { value: 'Русский', label: 'Русский' },
              ]}
            />

            <div className="flex items-center gap-3 mt-4 mb-8">
              <input 
                type="checkbox" 
                id="removeAccess"
                checked={formData.removeAccess}
                onChange={(e) => setFormData({...formData, removeAccess: e.target.checked})}
                className="w-5 h-5 border-gray-400 rounded text-blue-600 focus:ring-0 cursor-pointer"
              />
              <label htmlFor="removeAccess" className="text-gray-900 cursor-pointer select-none">
                Забрать доступ к панели администратора
              </label>
            </div>

            <button 
              onClick={handleSave}
              disabled={saving}
              className="w-full bg-[#006aff] hover:bg-blue-700 text-white font-medium py-3 rounded-md transition-colors"
            >
              {saving ? 'СОХРАНЕНИЕ...' : 'СОХРАНИТЬ ИЗМЕНЕНИЯ'}
            </button>
          </div>

        </div>
      </div>
    )
  }

  // LIST VIEW
  return (
    <div className="max-w-[1000px] mx-auto p-8">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-indigo-100 rounded-xl text-indigo-600">
          <UserCog size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold m-0 text-slate-900">Пользователи</h1>
          <p className="m-0 text-slate-500 text-sm">Управление квотами и доступами Pitch Avatar</p>
        </div>
      </div>

      <div className="mb-6 flex gap-4">
        <div className="relative flex-1 max-w-[320px]">
          <Search size={16} className="absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Поиск по email или имени..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full py-2.5 pl-10 pr-4 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-indigo-400"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Пользователь</th>
              <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</th>
              <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Listeners Seats</th>
              <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-slate-500">Загрузка данных из Supabase...</td>
              </tr>
            ) : filteredUsers.map(user => (
              <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-4 font-medium text-slate-900">{user.name}</td>
                <td className="p-4 text-slate-500 text-sm">{user.email}</td>
                <td className="p-4">
                  <span className="font-semibold text-slate-900 bg-slate-100 px-3 py-1 rounded-full text-sm">
                    {user.maxSeats}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => handleEditClick(user)}
                    className="inline-flex items-center gap-2 bg-white text-indigo-600 border border-indigo-200 hover:bg-indigo-50 rounded-lg px-3 py-1.5 cursor-pointer text-sm font-medium transition-colors"
                  >
                    <Edit3 size={16} /> Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && filteredUsers.length === 0 && (
          <div className="p-8 text-center text-slate-500">Ничего не найдено.</div>
        )}
      </div>
    </div>
  )
}
