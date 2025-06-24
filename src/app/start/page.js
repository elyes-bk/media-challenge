'use client'
import Image from 'next/image'
import { supabase } from '../../lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {

  const router = useRouter();

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

  const registerForm= () => {
    router.push('/register')
  }

  const loginForm= () => {
    router.push('/login')
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f5ecdc] px-4 py-8">
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
      <h1 className="text-2xl font-bold text-center mb-2 text-[#23221f]">Rejoignez-nous</h1>
      <p className="text-center text-[#23221f] mb-8">
        Créez votre compte ou connectez-vous<br />
        pour explorer Paris autrement
      </p>

      {/* Boutons principaux */}
      <div className="w-full max-w-xs flex flex-col gap-4">
        <button className="bg-[#179a9c] text-white font-semibold py-3 rounded-lg text-base shadow transition hover:bg-[#12787a]"
          onClick={registerForm}
        >
          Créer un compte
        </button>
        <button className="border text-[#23221f] font-semibold py-3 rounded-lg text-base bg-[#f5ecdc] shadow-sm transition hover:bg-gray-100"
          onClick={loginForm}
        >
          Se connecter
        </button>
      </div>

      {/* Séparateur */}
      <div className="flex items-center w-full max-w-xs my-6">
        <div className="flex-grow h-px bg-[#d2c7b9]" />
        <span className="mx-3 text-[#6e6a65] text-sm font-medium">OU</span>
        <div className="flex-grow h-px bg-[#d2c7b9]" />
      </div>

      {/* Bouton Google uniquement */}
      <div className="w-full max-w-xs flex flex-col gap-3">
        <button
          type="button"
          className="flex items-center justify-center gap-3 bg-white py-3 rounded-lg font-semibold text-[#23221f] shadow border border-gray-200 hover:bg-gray-50 transition"
          onClick={handleGoogleLogin}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <g>
              <path fill="#4285F4" d="M21.35 11.1h-9.18v2.92h5.98c-.26 1.43-1.57 4.19-5.98 4.19-3.6 0-6.53-2.98-6.53-6.66s2.93-6.66 6.53-6.66c2.05 0 3.42.87 4.2 1.61l2.87-2.8C17.31 2.73 15.02 1.5 12.17 1.5 6.76 1.5 2.23 6.03 2.23 11.44s4.53 9.94 9.94 9.94c5.74 0 9.52-4.02 9.52-9.7 0-.65-.07-1.14-.16-1.58z"/>
              <path fill="#34A853" d="M3.64 7.54l2.44 1.79c.66-1.26 2.13-2.9 5.09-2.9 1.48 0 2.81.57 3.85 1.68l2.88-2.8C16.1 3.54 14.24 2.5 12.17 2.5c-3.48 0-6.45 2.36-7.53 5.04z"/>
              <path fill="#FBBC05" d="M12.17 21.44c2.84 0 5.22-.94 6.96-2.55l-3.21-2.64c-.89.6-2.07.96-3.75.96-3.02 0-5.57-2.02-6.48-4.73l-3.17 2.46c1.54 3.05 4.85 5.5 8.65 5.5z"/>
              <path fill="#EA4335" d="M21.35 11.1h-9.18v2.92h5.98c-.26 1.43-1.57 4.19-5.98 4.19-3.6 0-6.53-2.98-6.53-6.66s2.93-6.66 6.53-6.66c2.05 0 3.42.87 4.2 1.61l2.87-2.8C17.31 2.73 15.02 1.5 12.17 1.5 6.76 1.5 2.23 6.03 2.23 11.44s4.53 9.94 9.94 9.94c5.74 0 9.52-4.02 9.52-9.7 0-.65-.07-1.14-.16-1.58z"/>
            </g>
          </svg>
          Continuer avec Google
        </button>
      </div>

      {/* Lien continuer sans compte */}
      <div className="w-full max-w-xs mt-8">
        <a href="/events" className="flex items-center justify-center gap-2 font-semibold underline text-[#23221f] text-base hover:text-[#179a9c] transition">
          Continuer sans compte
          <span aria-hidden="true" className="text-lg">→</span>
        </a>
      </div>

      {/* Mentions légales */}
      <p className="text-xs text-[#6e6a65] text-center max-w-xs mt-4">
        En vous inscrivant, vous acceptez nos conditions générales d’utilisation et notre politique de confidentialité.
      </p>
    </div>
  )
}
