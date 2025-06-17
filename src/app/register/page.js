'use client'

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function RegisterPage(){

    const [email,setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confPassword, setConfPassword] = useState('')
    const [message, setMessage] = useState('')
    const [surnom, setSurnom] = useState('');


    const handleRegister = async (e) => {
        e.preventDefault();

        if(password!==confPassword){
            setMessage('Les mots de passe ne correspondent pas')
            return;
        }

        try {
            const { data, error } = await supabase.auth.signUp({ email, password });

            if (error) {
                setMessage("Erreur : " + error.message);
                return;
            }

            const insertResult = await supabase.from('users').insert({
                id: data.user.id,
                surnom,
                email,
                role: 0
            });

            if (insertResult.error) {
                setMessage("Erreur insertion profil : " + insertResult.error.message);
                return;
            }

            setMessage("Inscription réussie ! Vérifie ton email.");
            } catch (err) {
            setMessage("Erreur inattendue : " + err.message);
            }
    }

    return (
        <div style={{ padding: '2rem' }}>
        <h1>Inscription</h1>
        <form onSubmit={handleRegister}>
            <input
            type="text"
            placeholder="Surnom"
            value={surnom}
            onChange={(e) => setSurnom(e.target.value)}
            required
            /><br /><br />

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
            <input
            type="password"
            placeholder="Confirmer le mot de passe"
            value={confPassword}
            onChange={(e) => setConfPassword(e.target.value)}
            required
            /><br /><br />
            
            <button type="submit">S'inscrire</button>
        </form>
        <p>{message}</p>
        </div>
    );
}