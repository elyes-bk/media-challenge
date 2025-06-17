'use client';

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function adminPage(){

    const [user, setUser] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        const verifyAdmin = async()=>{
            
        }
    })

    return(
        <div style={{ padding: '2rem' }}>
            <h1>Page Admin</h1>
            <p>Bienvenue, !</p>

            <p>Formulaire d’upload à venir...</p>
        </div>  
    )
}