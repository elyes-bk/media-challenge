"use client";
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import Nav from '../../components/Nav';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setIsConnected(true);
        console.log("✅ Utilisateur connecté :", session.user.email);
      } else {
        setIsConnected(false);
        console.log("🚫 Aucun utilisateur connecté");
      }
    };      
    checkSession();
  });



  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) setError(error.message);
    setLoading(false);
  };

  const handleLogout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Erreur déconnexion :", error.message);
  } else {
    console.log("✅ Déconnecté avec succès");
    setIsConnected(false); // Met à jour ton état local
    setEmail('');
    setPassword('');
  }
};


  return (
    <div>
        <Nav />
        <div style={{
        maxWidth: 320,
        margin: '100px auto',
        padding: 24,
        border: '1px solid #ddd',
        borderRadius: 8,
        background: '#fff'
        }}>
        <h2 style={{textAlign: 'center'}}>Connexion</h2>
        <form onSubmit={handleLogin}>
            <div style={{marginBottom: 12}}>
            <input
                type="email"
                placeholder="Email"
                value={email}
                required
                onChange={e => setEmail(e.target.value)}
                style={{
                width: '100%',
                padding: 8,
                border: '1px solid #bbb',
                borderRadius: 4
                }}
            />
            </div>
            <div style={{marginBottom: 12}}>
            <input
                type="password"
                placeholder="Mot de passe"
                value={password}
                required
                onChange={e => setPassword(e.target.value)}
                style={{
                width: '100%',
                padding: 8,
                border: '1px solid #bbb',
                borderRadius: 4
                }}
            />
            </div>
            {error && (
            <div style={{color: 'red', marginBottom: 12, fontSize: 14}}>
                {error}
            </div>
            )}
            <button
            type="submit"
            disabled={loading}
            style={{
                width: '100%',
                padding: 10,
                background: '#222',
                color: '#fff',
                border: 'none',
                borderRadius: 4,
                cursor: 'pointer'
            }}
            >
            {loading ? 'Connexion...' : 'Se connecter'}
              </button>
              {isConnected && (
              <button
                onClick={handleLogout}
                style={{
                  marginTop: 20,
                  width: '100%',
                  padding: 10,
                  background: '#d33',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 4,
                  cursor: 'pointer'
                }}
              >
                Se déconnecter
              </button>
            )};
        </form>
        </div>
    </div>
  );
}
