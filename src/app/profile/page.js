// 'use client'

// import { useState } from "react";
// import { useRouter } from 'next/navigation';
// import { supabase } from "@/lib/supabaseClient";


// export default function Profil({ children }) {
//   const router = useRouter();
//   const [error, setError] = useState('');

//   const handleLogout = async () => {
//     const { error } = await supabase.auth.signOut();
//     if (error) {
//       setError("Erreur lors de la déconnexion : " + error.message);
//     } else {
//       // Optionnel : rediriger vers la page de login ou d'accueil
//       router.replace('/login');
//     }
//   };

//   return (
//     <div>
//       <h1>hello</h1>
//       <button
//         onClick={handleLogout}
//         className="mt-4 bg-[#d33] text-white font-semibold py-2 px-4 rounded shadow hover:bg-[#b22] transition"
//       >
//         Se déconnecter
//       </button>
//       {error && (
//         <div className="text-red-600 text-sm mt-2">{error}</div>
//       )}
//     </div>
//   );
// }

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
  const [sunActive, setSunActive] = useState(false)
  const router = useRouter()

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

  if (loading) return <div style={{ textAlign: 'center', marginTop: 50 }}>Chargement...</div>

  return (
    <div style={{ backgroundColor: '#f6f0e6', color: '#1B1811', minHeight: '100vh', padding: '20px' }}>
      {/* Mode clair/obscur */}
      <div
        onClick={() => setSunActive(!sunActive)}
        style={{
          position: 'absolute',
          top: 20,
          right: 20,
          cursor: 'pointer',
          color: sunActive ? '#000' : 'transparent',
          WebkitTextStroke: sunActive ? 'none' : '1.5px black',
          textStroke: sunActive ? 'none' : '1.5px black',
        }}
        title="Basculer mode"
      >
        <MdWbSunny size={24} />
      </div>

      {/* Profil */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
        <div style={{ position: 'relative', marginRight: 16 }}>
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              backgroundColor: '#ccc',
              position: 'relative',
            }}
          >
            {user.avatar_url ? (
              <img
                src={user.avatar_url}
                alt="Avatar"
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
              />
            ) : (
              <div style={{ width: '100%', height: '100%' }} />
            )}

            {/* Label cliquable pour upload avec stylo + carré incomplet */}
            <label
              htmlFor="avatarUpload"
              title="Modifier l'avatar"
              style={{
                position: 'absolute',
                top: 0,          
                right: 0,
                width: 28,
                height: 28,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 4,
                boxSizing: 'border-box',
                zIndex: 2,
              }}
            
            >
              <BiSolidEdit size={30} color="#1B1811" />
            </label>

            {/* UploadAvatar input file invisible */}
            <UploadAvatar userId={user.id} onUpload={handleAvatarUpload} />
          </div>
        </div>

        <div>
          <div style={{ fontSize: 16, fontWeight: 'bold' }}>{user.surnom || 'Pseudo'}</div>
          <div style={{ fontSize: 14 }}>{`${user.nom || 'Nom'} ${user.prenom || 'Prénom'}`}</div>
        </div>
      </div>

      {/* Historique vidéos */}
      <div>
        {videos.length === 0 ? (
          <div style={{ textAlign: 'center', marginTop: 60 }}>
            <div
              style={{
                width: 60,
                height: 60,
                border: '1px solid #000',
                borderRadius: '50%',
                margin: '0 auto 6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transform: 'translateY(-4px)',
              }}
            >
              <MdPlayArrow size={28} />
            </div>
            <p style={{ fontSize: 14 }}>Aucun historique</p>
          </div>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {videos.map((video) => (
              <li key={video.id} style={{ marginBottom: 24 }}>
                <h3 style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8 }}>{video.titre}</h3>
                <video
                  src={video.url_importee}
                  controls
                  style={{ width: '100%', borderRadius: 12, marginBottom: 8 }}
                />
                <p style={{ fontSize: 14 }}>{video.description}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
