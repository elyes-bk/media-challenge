'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabaseClient';

export default function EditProfilePage() {
  const [user, setUser] = useState(null);
  const [surnom, setSurnom] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: authData, error: authError } = await supabase.auth.getUser();

      if (authError || !authData?.user) {
        router.push('/login');
        return;
      }

      const userId = authData.user.id;

      const { data, error } = await supabase
        .from('users')
        .select('id, surnom, email')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Erreur de chargement du profil :', error.message);
      } else {
        setUser(data);
        setSurnom(data.surnom);
        setEmail(data.email);
      }

      setLoading(false);
    };

    fetchProfile();
  }, [router]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!user) return;

    setLoading(true);
    setMessage('');

    const emailChanged = email !== user.email;
console.log('Redirect to:', `${window.location.origin}/profile`);

    // 1. Mettre à jour l'e-mail dans l'authentification Supabase
    const { error: authError } = await supabase.auth.updateUser({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/profile`
      }
    });

    if (authError) {
      console.error('Erreur mise à jour auth:', authError.message);
      setMessage("Erreur lors de la mise à jour de l'email (auth).");
      setLoading(false);
      return;
    }

    // 2. Mettre à jour la table "users"
    const { error: dbError } = await supabase
      .from('users')
      .update({ surnom, email })
      .eq('id', user.id);

    if (dbError) {
      console.error('Erreur lors de la mise à jour du profil:', dbError.message);
      setMessage("Erreur lors de la mise à jour du profil.");
    } else {
      if (emailChanged) {
        setMessage("Email mis à jour. Veuillez vérifier votre boîte mail pour confirmer.");
      } else {
        setMessage("Profil mis à jour avec succès !");
        setTimeout(() => router.push('/profile'), 2000);
      }
    }

    setLoading(false);
  };

  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: 50 }}>Chargement...</div>;
  }

  return (
    <div style={{
      maxWidth: 500,
      margin: '50px auto',
      padding: 30,
      border: '1px solid #ccc',
      borderRadius: 10,
      backgroundColor: '#f9f9f9',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ fontSize: 24, marginBottom: 20 }}>Modifier mon profil</h1>

      <form onSubmit={handleUpdate}>
        <div style={{ marginBottom: 15 }}>
          <label style={{ display: 'block', marginBottom: 5 }}>Surnom :</label>
          <input
            type="text"
            value={surnom}
            onChange={(e) => setSurnom(e.target.value)}
            style={{ width: '100%', padding: 8 }}
            required
          />
        </div>

        <div style={{ marginBottom: 15 }}>
          <label style={{ display: 'block', marginBottom: 5 }}>Email :</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', padding: 8 }}
            required
          />
        </div>

        <button type="submit" style={{
          padding: 10,
          backgroundColor: '#0070f3',
          color: '#fff',
          border: 'none',
          borderRadius: 5,
          cursor: 'pointer'
        }}>
          Enregistrer
        </button>
      </form>

      {message && (
        <p style={{ marginTop: 20, color: message.includes('succès') ? 'green' : 'orange' }}>
          {message}
        </p>
      )}
    </div>
  );
}
