"use client";
import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import Nav from '../../components/Nav';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
        </form>
        </div>
    </div>
  );
}
