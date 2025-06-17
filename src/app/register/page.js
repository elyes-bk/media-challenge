'use client'

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function RegistrerPage(){

    const [email,setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('')

    const handleRegister = async (e) => {
        e.preventDefault();

        const {data, error} = await supabase.auth.signUp({
            email,
            password
        })

        if(error){
            setMessage('Erreur: '+ error.message);
            return;
        }

        await supabase.from('users').insert({
            id: data.user.id,
            email,
            role: 'user'
        })

        setMessage('Inscription réussie ! Vérifie ton email.')
    }

    return (
        <div style={{ padding: '2rem' }}>
        <h1>Inscription</h1>
        <form onSubmit={handleRegister}>
            <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            /><br /><br />
            <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            /><br /><br />
            <button type="submit">S'inscrire</button>
        </form>
        <p>{message}</p>
        </div>
    );
}