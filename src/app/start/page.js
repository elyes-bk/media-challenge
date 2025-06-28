'use client'
import Image from 'next/image'
import { useEffect,useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabaseClient'

export default function RegisterPage() {
  const router = useRouter()
  const [isConnected,setIsConnected] = useState(false)

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        router.replace('/')  // pour rediriger si déjà connecté
      }
    }
    checkSession()
  }, [router])

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: typeof window !== 'undefined'
          ? `${window.location.origin}/auth/callback`
          : undefined,
      }
    })
    if (error) {
      alert('Erreur lors de la connexion avec Google : ' + error.message)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f5ecdc] dark:bg-[#23221f] px-4 py-8 transition-colors duration-300">
      {/* Logo */}
      <div className="mb-8">
        <Image
          src="/logo-vp.svg"
          alt="Voix Publiques"
          width={100}
          height={60}
          className="mx-auto"
        />
      </div>

      {/* Titre */}
      <h1 className="text-2xl font-bold text-center mb-2 text-[#23221f] dark:text-white">Rejoignez-nous</h1>
      <p className="text-center text-[#23221f] dark:text-white mb-8">
        Créez votre compte ou connectez-vous<br />
        pour explorer Paris autrement
      </p>

      {/* Boutons principaux avec redirection */}
      <div className="w-full max-w-xs flex flex-col gap-4">
        <button
          className="bg-[#179a9c] dark:bg-[#12787a] text-white font-semibold py-3 rounded-lg text-base shadow transition hover:bg-[#12787a] dark:hover:bg-[#179a9c]"
          onClick={() => router.push('/register')}
        >
          Créer un compte
        </button>
        <button
          className="border text-[#23221f] dark:text-white font-semibold py-3 rounded-lg text-base bg-[#f5ecdc] dark:bg-[#23221f] shadow-sm transition hover:bg-gray-100 dark:hover:bg-[#333]"
          onClick={() => router.push('/login')}
        >
          Se connecter
        </button>
      </div>

      {/* Séparateur */}
      <div className="flex items-center w-full max-w-xs my-6">
        <div className="flex-grow h-px bg-[#d2c7b9] dark:bg-[#444]" />
        <span className="mx-3 text-[#6e6a65] dark:text-[#bbb] text-sm font-medium">OU</span>
        <div className="flex-grow h-px bg-[#d2c7b9] dark:bg-[#444]" />
      </div>

      {/* Bouton Google uniquement */}
      <div className="w-full max-w-xs flex flex-col gap-3">
        <button
          type="button"
          className="flex items-center justify-center gap-3 bg-white dark:bg-[#23221f] py-3 rounded-lg font-semibold text-[#23221f] dark:text-white shadow border border-gray-200 dark:border-[#444] hover:bg-gray-50 dark:hover:bg-[#333] transition"
          onClick={handleGoogleLogin}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            {/* ...svg paths... */}
          </svg>
          Continuer avec Google
        </button>
      </div>

      {/* Lien continuer sans compte */}
      <div className="w-full max-w-xs mt-8">
        <a href="/events" className="flex items-center justify-center gap-2 font-semibold underline text-[#23221f] dark:text-white text-base hover:text-[#179a9c] dark:hover:text-[#7fd" transition>
          Continuer sans compte
          <span aria-hidden="true" className="text-lg">→</span>
        </a>
      </div>

      {/* Mentions légales */}
      <p className="text-xs text-[#6e6a65] dark:text-[#bbb] text-center max-w-xs mt-4">
        En vous inscrivant, vous acceptez nos{' '}
        <a
          href="/conditions-utilisation"
          className="underline hover:text-[#179a9c] dark:hover:text-[#7fd]"
          target="_blank"
          rel="noopener noreferrer"
        >
          conditions générales d’utilisation
        </a>
        {' '}et notre{' '}
        <a
          href="/politique-confidentialite"
          className="underline hover:text-[#179a9c] dark:hover:text-[#7fd]"
          target="_blank"
          rel="noopener noreferrer"
        >
          politique de confidentialité
        </a>
        .
      </p>

    </div>
  )
}
