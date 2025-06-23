'use client';
import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import Nav from '../../components/Nav';

export default function Register() {
  const [email, setEmail] = useState('');
  const [surnom, setSurnom] = useState('');
  const [password, setPassword] = useState('');
  const [confPassword, setConfPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    if (password !== confPassword) {
      setError("Les mots de passe ne correspondent pas.");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          surnom,
          role: false, // rôle user par défaut
          theme: false
        }
      }
    });

    if (error) {
      setError(error.message);
    } else {
      setMessage("Inscription réussie ! Vérifie ton email.");
      setEmail('');
      setPassword('');
      setConfPassword('');
      setSurnom('');
      
      await supabase.from('users').insert({
        id: data.user.id,
        email,
        surnom,
        role: false,
        theme: false
      })
    }

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
        <h2 style={{ textAlign: 'center' }}>Inscription</h2>
        <form onSubmit={handleRegister}>
          <div style={{ marginBottom: 12 }}>
            <input
              type="text"
              placeholder="Surnom"
              value={surnom}
              onChange={(e) => setSurnom(e.target.value)}
              required
              style={{
                width: '100%',
                padding: 8,
                border: '1px solid #bbb',
                borderRadius: 4
              }}
            />
          </div>
          <div style={{ marginBottom: 12 }}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: 8,
                border: '1px solid #bbb',
                borderRadius: 4
              }}
            />
          </div>
          <div style={{ marginBottom: 12 }}>
            <input
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: 8,
                border: '1px solid #bbb',
                borderRadius: 4
              }}
            />
          </div>
          <div style={{ marginBottom: 12 }}>
            <input
              type="password"
              placeholder="Confirmer le mot de passe"
              value={confPassword}
              onChange={(e) => setConfPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: 8,
                border: '1px solid #bbb',
                borderRadius: 4
              }}
            />
          </div>
          {error && (
            <div style={{ color: 'red', marginBottom: 12, fontSize: 14 }}>
              {error}
            </div>
          )}
          {message && (
            <div style={{ color: 'green', marginBottom: 12, fontSize: 14 }}>
              {message}
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
            {loading ? 'Inscription...' : "S'inscrire"}
          </button>
        </form>
      </div>
    </div>
  );
}
