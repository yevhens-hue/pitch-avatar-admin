'use client'

import React, { useState, useEffect } from 'react'
import { Search, UserCog, Edit3, Eye, EyeOff } from 'lucide-react'
import { supabase } from '../../lib/supabase'

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editingUserId, setEditingUserId] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    hubspotEmail: '',
    password: '',
    company: '',
    companyRole: '',
    tariff: 'Enterprise',
    listenersSeats: 10,
    language: 'English',
    removeAccess: false,
  })
  const [showPassword, setShowPassword] = useState(false)

  // Fetch Users and Listener Seats
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
            maxListenersWithAssignments: seatData ? seatData.max_seats : 100, // Default 100 as in app
            company: 'ROI4CIO', // Mock extra fields not in DB
            tariff: 'Enterprise',
            language: 'English'
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
      companyRole: '',
      tariff: user.tariff || 'Enterprise',
      listenersSeats: user.maxListenersWithAssignments || 0,
      language: user.language || 'English',
      removeAccess: false,
    })
  }

  const handleSave = async () => {
    if (!editingUserId) return;
    
    try {
      // Check if listener_seats entry exists for this user
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
    }
  }

  const handleDelete = () => {
    // Cannot really delete a presenter easily here due to constraints, mock the UI action
    setEditingUserId(null)
  }

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  )

  if (editingUserId) {
    return (
      <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem', background: '#f8fafc', minHeight: '100vh' }}>
        {/* Top bar */}
        <div style={{ display: 'flex', gap: '0.75rem', background: 'white', padding: '1rem 2rem', borderBottom: '1px solid #e2e8f0', margin: '-2rem -2rem 0 -2rem' }}>
          <button onClick={handleSave} style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '0.5rem 1.5rem', borderRadius: 4, fontWeight: 600, cursor: 'pointer' }}>SAVE</button>
          <button onClick={() => setEditingUserId(null)} style={{ background: 'white', color: '#3b82f6', border: '1px solid #bfdbfe', padding: '0.5rem 1.5rem', borderRadius: 4, fontWeight: 600, cursor: 'pointer' }}>CLOSE</button>
          <button onClick={handleDelete} style={{ background: 'white', color: '#ef4444', border: '1px solid #fecaca', padding: '0.5rem 1.5rem', borderRadius: 4, fontWeight: 600, cursor: 'pointer' }}>DELETE</button>
        </div>

        {/* Edit Form Card */}
        <div style={{ alignSelf: 'center', background: 'white', borderRadius: 12, border: '1px solid #e2e8f0', width: '100%', maxWidth: 600, padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h2 style={{ textAlign: 'center', fontSize: '1.25rem', fontWeight: 600, color: '#0f172a', marginBottom: '1rem' }}>Create / edit user</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            <label style={{ fontSize: '0.8rem', color: '#3b82f6' }}>Name *</label>
            <input type="text" value={formData.name} readOnly style={{ padding: '0.75rem', borderRadius: 6, border: '1px solid #e2e8f0', outline: 'none', background: '#f1f5f9' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            <label style={{ fontSize: '0.8rem', color: '#3b82f6' }}>Email *</label>
            <input type="email" value={formData.email} readOnly style={{ padding: '0.75rem', borderRadius: 6, border: '1px solid #e2e8f0', outline: 'none', background: '#f1f5f9' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            <label style={{ fontSize: '0.8rem', color: '#94a3b8' }}>HubSpot Email</label>
            <input type="email" value={formData.hubspotEmail} placeholder="HubSpot Email" onChange={e => setFormData({...formData, hubspotEmail: e.target.value})} style={{ padding: '0.75rem', borderRadius: 6, border: '1px solid #e2e8f0', outline: 'none' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', position: 'relative' }}>
            <label style={{ fontSize: '0.8rem', color: '#3b82f6' }}>Password *</label>
            <input type={showPassword ? 'text' : 'password'} value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} style={{ padding: '0.75rem', borderRadius: 6, border: '1px solid #e2e8f0', outline: 'none' }} />
            <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '1rem', top: '2.2rem', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
              {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            <label style={{ fontSize: '0.8rem', color: '#3b82f6' }}>Company *</label>
            <select value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} style={{ padding: '0.75rem', borderRadius: 6, border: '1px solid #e2e8f0', outline: 'none', background: 'white' }}>
              <option value="ROI4CIO">ROI4CIO</option>
              <option value="Acme">Acme</option>
              <option value="Smith Co">Smith Co</option>
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            <label style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Company Role</label>
            <input type="text" value={formData.companyRole} placeholder="Member" onChange={e => setFormData({...formData, companyRole: e.target.value})} style={{ padding: '0.75rem', borderRadius: 6, border: '1px solid #e2e8f0', outline: 'none' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            <label style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Tariff</label>
            <select value={formData.tariff} onChange={e => setFormData({...formData, tariff: e.target.value})} style={{ padding: '0.75rem', borderRadius: 6, border: '1px solid #e2e8f0', outline: 'none', background: 'white' }}>
              <option value="Enterprise">Enterprise</option>
              <option value="Pro">Pro</option>
              <option value="Basic">Basic</option>
            </select>
          </div>

          {/* Listeners Seats - The main feature for the superadmin */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            <label style={{ fontSize: '0.8rem', color: '#3b82f6' }}>Listeners Seats</label>
            <input type="number" value={formData.listenersSeats} onChange={e => setFormData({...formData, listenersSeats: parseInt(e.target.value) || 0})} style={{ padding: '0.75rem', borderRadius: 6, border: '1px solid #3b82f6', outline: 'none', boxShadow: '0 0 0 1px #3b82f6' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            <label style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Language</label>
            <select value={formData.language} onChange={e => setFormData({...formData, language: e.target.value})} style={{ padding: '0.75rem', borderRadius: 6, border: '1px solid #e2e8f0', outline: 'none', background: 'white' }}>
              <option value="English">English</option>
              <option value="Spanish">Spanish</option>
              <option value="Ukrainian">Ukrainian</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem' }}>
            <input type="checkbox" id="removeAccess" checked={formData.removeAccess} onChange={e => setFormData({...formData, removeAccess: e.target.checked})} style={{ width: 16, height: 16 }} />
            <label htmlFor="removeAccess" style={{ fontSize: '0.85rem', color: '#64748b' }}>Remove access to Admin Panel</label>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 1000, padding: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ padding: '0.75rem', background: '#e0e7ff', borderRadius: 12, color: '#4f46e5' }}>
          <UserCog size={24} />
        </div>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0, color: '#0f172a' }}>Users Management</h1>
          <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>Manage real users from Supabase</p>
        </div>
      </div>

      <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem' }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: 320 }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: 12, color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%', padding: '0.65rem 1rem 0.65rem 2.2rem', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: '0.9rem' }}
          />
        </div>
      </div>

      <div style={{ background: 'white', borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
            <tr>
              <th style={{ padding: '1rem', fontSize: '0.8rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>User</th>
              <th style={{ padding: '1rem', fontSize: '0.8rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Email</th>
              <th style={{ padding: '1rem', fontSize: '0.8rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Max Listeners with Assignments</th>
              <th style={{ padding: '1rem', fontSize: '0.8rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>Loading real data from Supabase...</td>
              </tr>
            ) : filteredUsers.map(user => (
              <tr key={user.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '1rem', fontWeight: 600, color: '#1e293b' }}>{user.name}</td>
                <td style={{ padding: '1rem', color: '#475569', fontSize: '0.9rem' }}>{user.email}</td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ fontWeight: 600, color: '#0f172a' }}>{user.maxListenersWithAssignments}</span>
                </td>
                <td style={{ padding: '1rem' }}>
                  <button
                    onClick={() => handleEditClick(user)}
                    style={{ background: '#f1f5f9', color: '#64748b', border: '1px solid #e2e8f0', borderRadius: 6, padding: '0.4rem 0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}
                  >
                    <Edit3 size={14} /> Edit User
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && filteredUsers.length === 0 && (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>No users found.</div>
        )}
      </div>
    </div>
  )
}
