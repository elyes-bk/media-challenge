'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../../lib/supabaseClient'

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    // Supabase gère automatiquement le token dans le hash (#) pour toi côté client
    // Tu peux rediriger l'utilisateur où tu veux après l'auth
    router.replace('/')
  }, [router])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <p>Connexion en cours...</p>
    </div>
  )
}
