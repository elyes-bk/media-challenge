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
      router.replace('/login');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f5ecdc] dark:bg-[#23221f] transition-colors duration-300">
      <h1 className="text-3xl font-bold text-[#23221f] dark:text-white mb-8">
        hello
      </h1>
      <button
        onClick={handleLogout}
        className="mt-4 bg-[#d33] dark:bg-[#a22] text-white font-semibold py-2 px-4 rounded shadow hover:bg-[#b22] dark:hover:bg-[#d33] transition"
      >
        Se déconnecter
      </button>
      {error && (
        <div className="text-red-600 dark:text-red-400 text-sm mt-2">{error}</div>
      )}
      {children}
    </div>
  );
}
