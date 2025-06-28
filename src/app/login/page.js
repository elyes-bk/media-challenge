'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { supabase } from '../../lib/supabaseClient'
import { useRouter } from 'next/navigation'
import { getSessionAndRedirect } from '../../lib/auth.js'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        setIsConnected(true)
        router.replace('/')  // pour rediriger si déjà connecté
      } else {
        setIsConnected(false)
      }
    }
    checkSession()
  }, [router])

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    setLoading(false)
    if (error) {
      setError(error.message)
    } else {
      setIsConnected(true)
      router.replace('/') // Redirige UNIQUEMENT si la connexion a réussi
    }
  }

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      setError("Erreur déconnexion : " + error.message)
    } else {
      setIsConnected(false)
      setEmail('')
      setPassword('')
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-[#f5ecdc] dark:bg-[#23221f] px-4 py-6 relative transition-colors duration-300">
      {/* Header icons */}
      <div className="absolute top-4 left-4">
        <button
          aria-label="Retour"
          onClick={() => router.back()}
          className="text-[#23221f] dark:text-white text-2xl"
        >
          ←
        </button>
      </div>
      <div className="absolute top-4 right-4">
        {/* Le bouton de thème global est déjà dans le layout */}
      </div>

      {/* Logo */}
      <div className="mt-8 mb-6">
        <Image
          src="/logo-vp.svg"
          alt="Voix Publiques"
          width={80}
          height={40}
          className="mx-auto"
        />
      </div>

      {/* Titre */}
      <h1 className="text-2xl font-bold text-center mb-6 text-[#23221f] dark:text-white">
        Connexion à votre compte
      </h1>

      {/* Formulaire */}
      <form
        onSubmit={handleLogin}
        className="w-full max-w-xs flex flex-col gap-4"
        autoComplete="off"
      >
        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="text-sm font-medium text-[#23221f] dark:text-white">
            Mail
          </label>
          <input
            id="email"
            type="email"
            placeholder="votre.email@email.com"
            value={email}
            required
            onChange={e => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-[#444] rounded-lg bg-white dark:bg-[#23221f] text-[#23221f] dark:text-white placeholder-[#bdbdbd] dark:placeholder-[#aaa] font-medium focus:outline-none focus:ring-2 focus:ring-[#179a9c]"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="password" className="text-sm font-medium text-[#23221f] dark:text-white">
            Mot de passe
          </label>
          <input
            id="password"
            type="password"
            placeholder="Mot de passe"
            value={password}
            required
            onChange={e => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-[#444] rounded-lg bg-white dark:bg-[#23221f] text-[#23221f] dark:text-white placeholder-[#bdbdbd] dark:placeholder-[#aaa] font-medium focus:outline-none focus:ring-2 focus:ring-[#179a9c]"
          />
        </div>
        {error && (
          <div className="text-red-600 dark:text-red-400 text-sm">{error}</div>
        )}
        <button
          type="submit"
          disabled={loading}
          className={`w-full mt-2 bg-[#179a9c] dark:bg-[#12787a] text-white font-semibold py-3 rounded-lg text-base shadow transition hover:bg-[#12787a] dark:hover:bg-[#179a9c] ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {loading ? 'Connexion...' : 'Se connecter'}
        </button>
        {isConnected && (
          <button
            type="button"
            onClick={handleLogout}
            className="w-full mt-2 bg-[#d33] dark:bg-[#a22] text-white font-semibold py-3 rounded-lg text-base shadow transition hover:bg-[#b22] dark:hover:bg-[#d33]"
          >
            Se déconnecter
          </button>
        )}
      </form>

      {/* Mentions légales */}
      <p className="text-xs text-[#6e6a65] dark:text-[#bbb] text-center max-w-xs mt-6">
        En vous connectant, vous acceptez nos conditions générales d’utilisation et notre politique de confidentialité.
      </p>
    </div>
  )
}
