'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { useRouter } from 'next/navigation'
import { MdWbSunny, MdPlayArrow } from 'react-icons/md'
import { BiSolidEdit } from 'react-icons/bi'  
import UploadAvatar from '../../components/UploadAvatar'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [videos, setVideos] = useState([])
  const router = useRouter()

  // Gestion du thème (bascule dark/clair)
  const [isDark, setIsDark] = useState(false)
  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'))
  }, [])

  const toggleTheme = () => {
    const html = document.documentElement
    if (html.classList.contains('dark')) {
      html.classList.remove('dark')
      setIsDark(false)
      localStorage.setItem('theme', 'false')
    } else {
      html.classList.add('dark')
      setIsDark(true)
      localStorage.setItem('theme', 'true')
    }
  }

  const handleAvatarUpload = (newAvatarUrl) => {
    setUser(prev => ({ ...prev, avatar_url: newAvatarUrl }))
  }

  useEffect(() => {
    const fetchUser = async () => {
      await supabase.auth.getSession()
      const { data: authData, error: authError } = await supabase.auth.getUser()

      if (authError || !authData?.user) {
        router.push('/login')
        return
      }

      const userId = authData.user.id
      const { data: userDetails } = await supabase
        .from('users')
        .select('surnom, nom, prenom, avatar_url')
        .eq('id', userId)
        .single()

      setUser({ ...userDetails, id: userId, email: authData.user.email })
      setLoading(false)
    }

    fetchUser()
  }, [router])

  useEffect(() => {
    if (!user) return

    const fetchVideos = async () => {
      const response = await supabase
        .from('videos')
        .select('*')
        .eq('user_id', user.id)

      if (response.error) {
        console.error('Erreur de chargement vidéos :', response.error.message)
        setVideos([])
      } else {
        setVideos(response.data)
      }
    }

    fetchVideos()
  }, [user])

  if (loading) return <div className="text-center mt-12">Chargement...</div>

  return (
    <div className="bg-[#f6f0e6] dark:bg-[#23221f] text-[#1B1811] dark:text-white min-h-screen p-5 transition-colors duration-300 relative">
      {/* Bouton mode sombre/clair */}
      <button
        onClick={toggleTheme}
        className="absolute top-5 right-5 p-2 rounded-full bg-white dark:bg-[#23221f] border shadow hover:bg-gray-100 dark:hover:bg-[#444] transition"
        title="Basculer mode"
      >
        <MdWbSunny size={24} className={isDark ? "text-yellow-400" : "text-gray-700"} />
      </button>

      {/* Profil */}
      <div className="flex items-center mb-6">
        <div className="relative mr-4">
          <div className="w-20 h-20 rounded-full bg-gray-300 dark:bg-[#444] relative overflow-hidden">
            {user.avatar_url ? (
              <img
                src={user.avatar_url}
                alt="Avatar"
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <div className="w-full h-full" />
            )}
            {/* Label cliquable pour upload */}
            <label
              htmlFor="avatarUpload"
              title="Modifier l'avatar"
              className="absolute top-0 right-0 w-7 h-7 flex items-center justify-center rounded bg-white dark:bg-[#23221f] border shadow cursor-pointer"
              style={{ zIndex: 2 }}
            >
              <BiSolidEdit size={22} className="text-[#1B1811] dark:text-white" />
            </label>
            <UploadAvatar userId={user.id} onUpload={handleAvatarUpload} />
          </div>
        </div>
        <div>
          <div className="text-base font-bold">{user.surnom || 'Pseudo'}</div>
          <div className="text-sm">{`${user.nom || 'Nom'} ${user.prenom || 'Prénom'}`}</div>
        </div>
      </div>

      {/* Historique vidéos */}
      <div>
        {videos.length === 0 ? (
          <div className="text-center mt-16">
            <div className="w-15 h-15 border border-[#1B1811] dark:border-white rounded-full mx-auto mb-2 flex items-center justify-center">
              <MdPlayArrow size={28} />
            </div>
            <p className="text-sm">Aucun historique</p>
          </div>
        ) : (
          <ul className="list-none p-0">
            {videos.map((video) => (
              <li key={video.id} className="mb-6">
                <h3 className="text-base font-bold mb-2">{video.titre}</h3>
                <video
                  src={video.url_importee}
                  controls
                  className="w-full rounded-xl mb-2"
                />
                <p className="text-sm">{video.description}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
