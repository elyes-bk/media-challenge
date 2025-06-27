'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import AdminTabs from '../../components/AdminTabs'
import UserTable from '../../components/UserTable'
import EventTable from '../../components/EventTable'
import CategoryTable from '../../components/CategoryTable'
import VideoTable from '../../components/VideoTable'

export default function AdminPage() {

  const [activeTab, setActiveTab] = useState('users')
  const [loading, setLoading] = useState(true)
  const [authorized, setAuthorized] = useState(false)
  const router = useRouter()

  useEffect(()=>{
    const checkRole = async () => {
      const {data: {session}} = await supabase.auth.getSession()

      if(!session){
        router.push('/login')
        return
      }
    
      const {data: userData, error} = await supabase
        .from('users')
        .select('role')
        .eq('id',session.user.id)
        .single()

      if(error || !userData || userData.role !== true){
        router.push('/')
        return
      }

      setAuthorized(true)
      setLoading(false)
    }

    checkRole()
  },[])

  if(loading){
    return <p className="text-center text-gray-600 mt-20">Chargement...</p>
  }

  if (!authorized) return null

  

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <h1 className="text-4xl font-extrabold text-center mb-8 text-gray-900">Admin Panel</h1>
      <AdminTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="mt-8">
        {activeTab === 'users' && <UserTable />}
        {activeTab === 'events' && <EventTable />}
        {activeTab === 'categories' && <CategoryTable />}
        {activeTab === 'video' && <VideoTable />}
      </div>
    </div>
  )
}
