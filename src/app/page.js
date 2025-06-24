'use client';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Home({ children }) {
  const router = useRouter();
  const [error, setError] = useState('');

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      setError("Erreur lors de la déconnexion : " + error.message);
    } else {
      // Optionnel : rediriger vers la page de login ou d'accueil
      router.replace('/login');
    }
  };

  return (
    <div>
      <h1>hello</h1>
      <button
        onClick={handleLogout}
        className="mt-4 bg-[#d33] text-white font-semibold py-2 px-4 rounded shadow hover:bg-[#b22] transition"
      >
        Se déconnecter
      </button>
      {error && (
        <div className="text-red-600 text-sm mt-2">{error}</div>
      )}
    </div>
  );
}
