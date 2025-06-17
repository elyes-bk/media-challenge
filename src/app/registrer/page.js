'use client'

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function RegistrerPage(){

    const [email,setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('')

    const handleRegister = async (e) => {
        e.preventDefault();
    }
}