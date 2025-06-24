'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useRouter } from 'next/navigation';
import EditButton from '../../components/EditButton';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUserDetails = async () => {
      // Recharge session si nécessaire
      await supabase.auth.getSession();

      const { data: authData, error: authError } = await supabase.auth.getUser();

      if (authError || !authData?.user) {
        router.push('/login');
        return;
      }

      const userId = authData.user.id;

      const { data: userDetails, error: userError } = await supabase
        .from('users')
        .select('surnom, email')
        .eq('id', userId)
        .single();

      if (userError) {
        console.error('Erreur de récupération du profil :', userError.message);
        setUser({ id: userId, email: authData.user.email, surnom: 'Non défini' });
      } else {
        setUser({ ...userDetails, email: authData.user.email });
      }

      setLoading(false);
    };

    fetchUserDetails();
  }, [router]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', marginTop: 50 }}>
        Chargement...
      </div>
    );
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
      <h1 style={{ fontSize: 24, marginBottom: 20 }}>Bienvenue sur votre Dashboard</h1>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Surnom:</strong> {user.surnom}</p>
      <EditButton />
    </div>
  );
}
