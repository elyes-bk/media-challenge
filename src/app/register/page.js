

'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { supabase } from '../../lib/supabaseClient'
import { useRouter } from 'next/navigation'

function isPasswordValid(password) {
  // Minimum 8 caractères, 1 majuscule, 1 minuscule, 1 chiffre, 1 caractère spécial
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/
  return regex.test(password)
}

export default function Register() {
  const [surnom, setSurnom] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // Empêche l'accès si déjà connecté
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        router.replace('/') // Redirige vers l'accueil ou la page de ton choix
      }
    }
    checkSession()
  }, [router])

  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    // Validation simple
    if (!surnom || !email || !password) {
      setError("Tous les champs sont obligatoires.")
      setLoading(false)
      return
    }

    // Validation du mot de passe
    if (!isPasswordValid(password)) {
      setError("Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.")
      setLoading(false)
      return
    }

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          surnom,
          role: false,
          theme: false
        }
      }
    })

    if (signUpError) {
      setError(signUpError.message)
    } else {
      setMessage("Inscription réussie ! Vérifie ton email.")
      setSurnom('')
      setEmail('')
      setPassword('')

      // Insertion dans la table users si l'utilisateur existe
      if (data?.user) {
        await supabase.from('users').insert({
          id: data.user.id,
          email,
          surnom,
          role: false,
          theme: false
        })
      }
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-[#f5ecdc] px-4 py-6 relative">
      {/* Header icons */}
      <div className="absolute top-4 left-4">
        <button
          aria-label="Retour"
          onClick={() => router.back()}
          className="text-[#23221f] text-2xl"
        >
          ←
        </button>
      </div>
      <div className="absolute top-4 right-4">
        <button aria-label="Mode clair/sombre" className="text-[#23221f] text-xl">
          ☀️
        </button>
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
      <h1 className="text-2xl font-bold text-center mb-6 text-[#23221f]">
        Finaliser la création<br />du compte
      </h1>

      {/* Formulaire */}
      <form
        onSubmit={handleRegister}
        className="w-full max-w-xs flex flex-col gap-4"
        autoComplete="off"
      >
        <div className="flex flex-col gap-1">
          <label htmlFor="surnom" className="text-sm font-medium text-[#23221f]">
            Pseudo
          </label>
          <input
            id="surnom"
            type="text"
            placeholder="Votre pseudo"
            value={surnom}
            onChange={e => setSurnom(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-[#23221f] placeholder-[#bdbdbd] font-medium focus:outline-none focus:ring-2 focus:ring-[#179a9c]"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="text-sm font-medium text-[#23221f]">
            Mail
          </label>
          <input
            id="email"
            type="email"
            placeholder="Votre adresse mail"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-[#23221f] placeholder-[#bdbdbd] font-medium focus:outline-none focus:ring-2 focus:ring-[#179a9c]"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="password" className="text-sm font-medium text-[#23221f]">
            Mot de passe
          </label>
          <input
            id="password"
            type="password"
            placeholder="Votre mot de passe"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-[#23221f] placeholder-[#bdbdbd] font-medium focus:outline-none focus:ring-2 focus:ring-[#179a9c]"
          />
          <span className="text-xs text-[#6e6a65] mt-1">
            8 caractères minimum, 1 majuscule, 1 minuscule, 1 chiffre, 1 caractère spécial.
          </span>
        </div>

        {error && (
          <div className="text-red-600 text-sm">{error}</div>
        )}
        {message && (
          <div className="text-green-600 text-sm">{message}</div>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`w-full mt-2 bg-[#179a9c] text-white font-semibold py-3 rounded-lg text-base shadow transition hover:bg-[#12787a] ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {loading ? 'Inscription...' : "Créer un compte"}
        </button>
      </form>

      {/* Mentions légales */}
      <p className="text-xs text-[#6e6a65] text-center max-w-xs mt-6">
        En vous inscrivant, vous acceptez nos conditions générales d’utilisation et notre politique de confidentialité.
      </p>
    </div>
  )
}
