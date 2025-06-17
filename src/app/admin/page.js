'use client'

import { useState } from 'react'
import AdminTabs from '../../components/AdminTabs'
import UserTable from '../../components/UserTable'
import EventTable from '../../components/EventTable'
import CategoryTable from '../../components/CategoryTable'

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('users')

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <h1 className="text-4xl font-extrabold text-center mb-8 text-gray-900">Admin Panel</h1>
      <AdminTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="mt-8">
        {activeTab === 'users' && <UserTable />}
        {activeTab === 'events' && <EventTable />}
        {activeTab === 'categories' && <CategoryTable />}
      </div>
    </div>
  )
}
