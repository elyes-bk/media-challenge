'use client'

import { useRef } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function UploadAvatar({ userId, onUpload }) {
  const inputRef = useRef(null)

  const handleChange = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      alert("Fichier trop volumineux (max 5 Mo).")
      return
    }

    const fileExt = file.name.split('.').pop()
    const filePath = `avatars/${userId}.${fileExt}`

    // Upload dans le storage Supabase
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true })

    if (uploadError) {
      alert("Erreur lors de l'upload : " + uploadError.message)
      return
    }

    // Récupérer l'URL publique
    const { data: urlData } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath)

    if (urlData?.publicUrl) {
      // Met à jour la table 'users' avec la nouvelle URL de l'avatar
      const { error: updateError } = await supabase
        .from('users')
        .update({ avatar_url: urlData.publicUrl })
        .eq('id', userId)

      if (updateError) {
        alert("Erreur lors de la mise à jour de l'avatar : " + updateError.message)
        return
      }

      // Met à jour le state local dans le composant parent
      onUpload(urlData.publicUrl)
    }
  }

  return (
    <input
      id="avatarUpload"
      type="file"
      accept="image/*"
      style={{ display: 'none' }}
      ref={inputRef}
      onChange={handleChange}
    />
  )
}
