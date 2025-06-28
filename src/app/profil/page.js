'use client'

import { useState,useEffect } from "react";
import { useRouter } from 'next/navigation';
import { supabase } from "@/lib/supabaseClient";


export default function Profil({ children }) {
  const router = useRouter();
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
      <h2 className="text-xl font-bold mb-4">Lieux visités</h2>
      {visited.length === 0 ? (
        <p>Aucun lieu visité pour le moment.</p>
      ) : (
        <ul className="space-y-2">
          {visited.map((visit, index) => (
            <li key={index} className="border rounded p-2">
              <strong>{visit.events.titre}</strong><br />
              Visité le : {new Date(visit.visited_at).toLocaleString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}