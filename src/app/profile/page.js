'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { useRouter } from 'next/navigation'
import { MdPlayArrow } from 'react-icons/md'
import { BiSolidEdit } from 'react-icons/bi'  
import UploadAvatar from '../../components/UploadAvatar'
import logo from '../../../public/icon/Logo.png'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [videos, setVideos] = useState([])
  const router = useRouter()
  const [error, setError] = useState('');
  const [visited, setVisited] = useState([])


  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      setError("Erreur lors de la déconnexion : " + error.message);
    } else {
      // Optionnel : rediriger vers la page de login ou d'accueil
      router.replace('/login');
    }
  };

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

  //recuperation des lieux visité
  useEffect(() => {
    const fetchVisitedPlaces = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('visited_places')
        .select('visited_at, events(titre, adresse)') // récupère les infos liées
        .eq('user_id', user.id)

      if (error) console.error('Erreur :', error)
      else setVisited(data)
    }

    fetchVisitedPlaces()
  }, [])

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
    
    {/* Profil utilisateur */}
    <div className="flex items-center mb-6">
      <div className="relative mr-4">
        <div className="w-20 h-20 rounded-full bg-gray-300 dark:bg-[#444] overflow-hidden">
          {user.avatar_url ? (
            <img
              src={user.avatar_url}
              alt="Avatar"
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            <div className="w-full h-full" />
          )}
        </div>
      </div>
      <div>
        <div className="text-base font-bold">{user.surnom || 'Pseudo'}</div>
        <div className="text-sm text-gray-700 dark:text-gray-300">{user.email}</div>
        <span className="inline-block mt-1 px-2 py-1 text-xs bg-[#e8dfd3] text-[#1B1811] rounded">
          Marcheur de mémoire
        </span>
      </div>
    </div>

    {/* Bouton déconnexion */}
    <button
      onClick={handleLogout}
      className="mb-6 bg-[#d33] text-white font-semibold py-2 px-4 rounded shadow hover:bg-[#b22] transition"
    >
      Se déconnecter
    </button>

    {/* Lieux débloqués */}
    <div className="mb-8">
      <h2 className="text-lg font-bold mb-2">Lieux débloqués</h2>
      
      {visited.length === 0 ? (
        <p>Aucun lieu visité pour le moment.</p>
      ) : (
        <ul className="space-y-2">
          {visited.map((visit, index) => (
            <li key={index} className="flex items-center border rounded p-3 bg-white dark:bg-[#2c2b28]">
              {/* Logo */}
              <img
                src={logo}
                alt="Logo lieu"
                className="w-6 h-6 mr-3"
              />

              {/* Infos du lieu */}
              <div>
                <strong>{visit.events.titre}</strong><br />
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  Débloqué le : {new Date(visit.visited_at).toLocaleDateString()}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  </div>
)}