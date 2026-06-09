'use client'

import React, { useState } from 'react'
import { Info, CloudUpload, Wrench, Eye, Edit3 } from 'lucide-react'

// Custom Floating Label Components
const FloatingInput = ({ label, value, onChange, placeholder = " " }: any) => {
  return (
    <div className="relative mb-6">
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="block px-3 pb-3 pt-3 w-full text-gray-900 bg-white rounded-md border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-gray-500 peer"
      />
      <label className="absolute text-sm text-gray-500 bg-white px-1 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] left-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-1 peer-focus:scale-75 peer-focus:-translate-y-4">
        {label}
      </label>
    </div>
  )
}

const FloatingSelect = ({ label, value, onChange, options }: any) => {
  return (
    <div className="relative mb-6">
      <select
        value={value}
        onChange={onChange}
        className="block px-3 pb-3 pt-3 w-full text-gray-900 bg-white rounded-md border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-gray-500 peer"
      >
        <option value="" disabled></option>
        {options.map((opt: any) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      <label className="absolute text-sm text-gray-500 bg-white px-1 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] left-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-1 peer-focus:scale-75 peer-focus:-translate-y-4">
        {label}
      </label>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
      </div>
    </div>
  )
}

export default function CompaniesPage() {
  const [formData, setFormData] = useState({
    company: 'TestQA',
    tariff: 'Trial',
    didMinutes: 5,
    rechargeMinutes: '',
    settingMinutes: '5',
    removeHeader: false
  })

  const employees = [
    { id: '2610', name: 'Користувч Новий', time: '15:24', date: '11/9/2022' },
    { id: '2615', name: 'Vera K', time: '17:12', date: '11/10/2022' },
  ]

  return (
    <div className="min-h-screen bg-[#f8f9fa] py-10 flex justify-center">
      <div className="bg-white border border-gray-200 shadow-sm rounded-md w-full max-w-3xl p-8 pb-10">
        
        <h1 className="text-[24px] font-normal text-gray-900 mb-8">
          Редактировать компанию
        </h1>

        <div className="px-1">
          {/* Company Name */}
          <FloatingInput
            label="Компания"
            value={formData.company}
            onChange={(e: any) => setFormData({...formData, company: e.target.value})}
          />

          {/* Tariff */}
          <FloatingSelect
            label="Выберите тарифный план для всех сотрудников компании"
            value={formData.tariff}
            onChange={(e: any) => setFormData({...formData, tariff: e.target.value})}
            options={[
              { value: 'Trial', label: 'Trial' },
              { value: 'Developer', label: 'Developer' },
              { value: 'Enterprise', label: 'Enterprise' },
            ]}
          />

          {/* DID Minutes Section */}
          <div className="mb-8">
            <h3 className="text-[17px] font-semibold text-gray-900 mb-3">
              DID assistant minutes: {formData.didMinutes}
            </h3>

            {/* Recharge */}
            <div className="mb-4">
              <div className="flex items-center gap-1 text-sm text-gray-700 mb-2">
                Assistant minute recharge <Info size={14} className="text-gray-500" />
              </div>
              <div className="flex gap-4">
                <input 
                  type="text" 
                  placeholder="Assistant minutes"
                  value={formData.rechargeMinutes}
                  onChange={(e) => setFormData({...formData, rechargeMinutes: e.target.value})}
                  className="flex-1 max-w-xs border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
                />
                <button className="bg-[#006aff] hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-md text-sm transition-colors">
                  Recharge
                </button>
              </div>
            </div>

            {/* Setting */}
            <div>
              <div className="flex items-center gap-1 text-sm text-gray-700 mb-2 mt-4">
                Setting the number of assistant minutes. <Info size={14} className="text-gray-500" />
              </div>
              <div className="flex gap-4">
                <div className="relative flex-1 max-w-xs">
                  <input 
                    type="text" 
                    value={formData.settingMinutes}
                    onChange={(e) => setFormData({...formData, settingMinutes: e.target.value})}
                    className="block px-3 pb-2 pt-4 w-full text-sm text-gray-900 bg-white rounded-md border border-gray-300 appearance-none focus:outline-none focus:ring-0 peer"
                  />
                  <label className="absolute text-[11px] text-gray-500 bg-white px-1 -translate-y-3 top-2 left-2 z-10">
                    Assistant minutes
                  </label>
                </div>
                <button className="bg-[#006aff] hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-md text-sm transition-colors">
                  Save
                </button>
              </div>
            </div>
          </div>

          {/* Logo Upload */}
          <div className="mb-6">
            <div className="text-sm text-gray-900 mb-2">Логотип:</div>
            <button className="bg-[#006aff] hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md text-sm flex items-center gap-2 transition-colors">
              <CloudUpload size={18} />
              ЗАГРУЗИТЬ ФАЙЛ
            </button>
            <div className="flex items-center gap-1 text-[12px] text-gray-500 mt-2">
              Загрузите файлы .png, .gif или .jpg <Info size={12} />
            </div>
          </div>

          {/* Header Color */}
          <div className="mb-6">
            <div className="text-sm text-gray-900 mb-2">Цвет фона хедера:</div>
            {/* Mock Color Picker Graphic */}
            <div className="w-[200px] rounded-md overflow-hidden border border-gray-200 mb-4" style={{ height: '160px' }}>
              <div style={{ height: '140px', background: 'linear-gradient(to bottom, #d4a3a3, #000000)' }} className="relative">
                <div className="absolute left-0 bottom-0 w-6 h-6 rounded-full border-2 border-white bg-black -ml-3 -mb-3"></div>
              </div>
              <div style={{ height: '20px', background: 'linear-gradient(to right, red, yellow, lime, cyan, blue, magenta, red)' }} className="relative">
                <div className="absolute left-0 top-0 w-4 h-full border-2 border-white bg-red-600 shadow-sm rounded-sm -ml-2"></div>
              </div>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <input 
                type="checkbox" 
                id="removeHeader"
                checked={formData.removeHeader}
                onChange={(e) => setFormData({...formData, removeHeader: e.target.checked})}
                className="w-5 h-5 border-gray-400 rounded text-blue-600 focus:ring-0 cursor-pointer"
              />
              <label htmlFor="removeHeader" className="text-sm text-gray-900 cursor-pointer select-none">
                Удалить хедер
              </label>
            </div>

            <button className="bg-[#006aff] hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md text-sm flex items-center gap-2 transition-colors uppercase tracking-wide">
              <Wrench size={16} />
              Reset All Settings
            </button>
          </div>

          {/* Employees Table */}
          <div className="mt-8">
            <div className="text-sm text-gray-900 mb-4">Сотрудники</div>
            
            <table className="w-full text-sm text-left border-collapse">
              <thead>
                <tr className="text-gray-700">
                  <th className="py-2 px-4 font-normal">id</th>
                  <th className="py-2 px-4 font-normal">Пользоват...</th>
                  <th className="py-2 px-4 font-normal">Время соз...</th>
                  <th className="py-2 px-4 font-normal">Дата созда...</th>
                  <th className="py-2 px-4 font-normal"></th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp, idx) => (
                  <tr key={emp.id} className={idx % 2 === 0 ? 'bg-[#cccccc]' : 'bg-[#dbdbdb]'}>
                    <td className="py-3 px-4 text-gray-800">{emp.id}</td>
                    <td className="py-3 px-4 text-gray-800">{emp.name}</td>
                    <td className="py-3 px-4 text-gray-800">{emp.time}</td>
                    <td className="py-3 px-4 text-gray-800">{emp.date}</td>
                    <td className="py-3 px-4 text-gray-600 flex justify-end gap-3">
                      <button className="hover:text-gray-900 transition-colors">
                        <Eye size={18} />
                      </button>
                      <button className="hover:text-gray-900 transition-colors">
                        <Edit3 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  )
}
