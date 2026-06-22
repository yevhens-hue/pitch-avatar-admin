'use client';

import React, { useState } from 'react';
import { useEnrollmentFormStore } from '@/lib/enrollmentFormStore';

export default function AddEnrollmentPage() {
  const [activeTab, setActiveTab] = useState<'General' | 'Interaction' | 'Security' | 'Emails' | 'Links'>('General');
  const store = useEnrollmentFormStore();

  const handleSave = () => {
    const isValid = store.validate();
    if (isValid) {
      alert('Enrollment saved successfully!');
      // TODO: Submit to API
    } else {
      alert('Please fill out all required fields.');
    }
  };

  return (
    <div className="flex-1 p-8 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Create Enrollment</h1>
          <div className="flex gap-3">
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition">
              Cancel
            </button>
            <button 
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Save Enrollment
            </button>
          </div>
        </div>

        {/* Custom Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          {[
            { id: 'General', label: 'General' },
            { id: 'Interaction', label: 'Interaction & AI' },
            { id: 'Security', label: 'Security' },
            { id: 'Emails', label: 'Invitation & Reminders' },
            { id: 'Links', label: 'Share / Links' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content Area */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 min-h-[500px]">
          {activeTab === 'General' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold mb-4">General Information</h2>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title (shown to listener) <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    value={store.title}
                    onChange={(e) => store.setTitle(e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg outline-none transition-shadow ${
                      store.errors.title ? 'border-red-500 focus:ring-2 focus:ring-red-200' : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                    }`}
                    placeholder="e.g. Sales Onboarding 2026"
                  />
                  {store.errors.title && <p className="text-red-500 text-xs mt-1">{store.errors.title}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Target Type
                  </label>
                  <select 
                    value={store.targetType}
                    onChange={(e) => store.setTargetType(e.target.value as any)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="Anonymous">Anonymous (Shared Link)</option>
                    <option value="Listener">Listener</option>
                    <option value="Group" disabled>Group</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Presentation <span className="text-red-500">*</span>
                  </label>
                  <select 
                    value={store.presentationId}
                    onChange={(e) => store.setPresentationId(e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg outline-none transition-shadow ${
                      store.errors.presentationId ? 'border-red-500 focus:ring-2 focus:ring-red-200' : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                    }`}
                  >
                    <option value="" disabled>Select a presentation...</option>
                    <option value="pres-1">Q3 Roadmap Presentation</option>
                    <option value="pres-2">Onboarding Deck v2</option>
                  </select>
                  {store.errors.presentationId && <p className="text-red-500 text-xs mt-1">{store.errors.presentationId}</p>}
                </div>

                {store.targetType === 'Listener' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Select Listener <span className="text-red-500">*</span>
                    </label>
                    <select 
                      value={store.listenerId}
                      onChange={(e) => store.setListenerId(e.target.value)}
                      className={`w-full px-4 py-2 border rounded-lg outline-none transition-shadow ${
                        store.errors.listenerId ? 'border-red-500 focus:ring-2 focus:ring-red-200' : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                      }`}
                    >
                      <option value="" disabled>Select a listener...</option>
                      <option value="usr-1">John Doe (john@example.com)</option>
                      <option value="usr-2">Jane Smith (jane@example.com)</option>
                    </select>
                    {store.errors.listenerId && <p className="text-red-500 text-xs mt-1">{store.errors.listenerId}</p>}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'Interaction' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold mb-4">Interaction & AI Settings</h2>
              
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Choice at the beginning</p>
                  <p className="text-sm text-gray-500">Allow listeners to choose between viewing with or without the AI avatar.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={store.choiceAtBeginning} onChange={(e) => store.setChoiceAtBeginning(e.target.checked)} />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Chat Access</p>
                  <p className="text-sm text-gray-500">Allow listeners to ask questions to the AI avatar during the presentation.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={store.chatAccess} onChange={(e) => store.setChatAccess(e.target.checked)} />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Lead Generation</p>
                  <p className="text-sm text-gray-500">Require anonymous viewers to enter their email and name before starting.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={store.leadGeneration} onChange={(e) => store.setLeadGeneration(e.target.checked)} />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          )}

          {activeTab === 'Security' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold mb-4">Security & Access</h2>

              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Passcode Protection</p>
                  <p className="text-sm text-gray-500">Require a PIN code to access the presentation.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={store.passcodeProtection} onChange={(e) => store.setPasscodeProtection(e.target.checked)} />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {store.passcodeProtection && (
                <div className="pl-4 border-l-2 border-blue-500">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Passcode <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    value={store.passcode}
                    onChange={(e) => store.setPasscode(e.target.value)}
                    className={`w-64 px-4 py-2 border rounded-lg outline-none transition-shadow ${
                      store.errors.passcode ? 'border-red-500 focus:ring-2 focus:ring-red-200' : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                    }`}
                    placeholder="e.g. 123456"
                  />
                  {store.errors.passcode && <p className="text-red-500 text-xs mt-1">{store.errors.passcode}</p>}
                </div>
              )}

              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Allow Download</p>
                  <p className="text-sm text-gray-500">Allow the listener to download a PDF version of the slides.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={store.allowDownload} onChange={(e) => store.setAllowDownload(e.target.checked)} />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          )}

          {activeTab === 'Emails' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold mb-4">Invitation & Reminders</h2>
              <div className="grid grid-cols-2 gap-8">
                {/* Editor */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Invitation Subject
                    </label>
                    <input 
                      type="text" 
                      value={store.invitationSubject}
                      onChange={(e) => store.setInvitationSubject(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      placeholder="You are invited to view a presentation"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Invitation Message
                    </label>
                    <textarea 
                      value={store.invitationText}
                      onChange={(e) => store.setInvitationText(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 min-h-[150px]"
                      placeholder="Hi #Listener First Name#,&#10;Please check out this presentation..."
                    />
                    <div className="mt-2 flex gap-2 flex-wrap">
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded cursor-pointer hover:bg-gray-200" onClick={() => store.setInvitationText(store.invitationText + '#Listener First Name#')}>#Listener First Name#</span>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded cursor-pointer hover:bg-gray-200" onClick={() => store.setInvitationText(store.invitationText + '#Presentation Title#')}>#Presentation Title#</span>
                    </div>
                  </div>
                </div>

                {/* Live Preview */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-4 font-semibold">Live Email Preview</p>
                  <div className="bg-white border border-gray-200 rounded shadow-sm p-4 text-sm text-gray-800">
                    <p className="font-semibold mb-3 border-b pb-2">Subject: {store.invitationSubject || 'You are invited to view a presentation'}</p>
                    <div className="whitespace-pre-wrap">
                      {store.invitationText || "Hi [Listener Name],\n\nPlease check out this presentation: [Presentation Title].\n\nClick the link below to view it."}
                    </div>
                    <div className="mt-6 text-center">
                      <button className="bg-blue-600 text-white px-6 py-2 rounded-lg pointer-events-none">View Presentation</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Links' && (
            <div className="flex flex-col items-center justify-center min-h-[300px] text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Save the enrollment first</h3>
              <p className="text-gray-500 max-w-sm">
                You need to save this enrollment before you can generate sharing links, QR codes, or embed codes.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
