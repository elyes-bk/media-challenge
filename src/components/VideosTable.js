'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import ConfirmModal from './ConfirmModal'
import { v4 as uuidv4 } from 'uuid'

const initialForm = {
  titre: '',
  description: '',
  url: '',
  url_importee: '',
  event_id: ''
}

export default function VideoTable() {
  const [videos, setVideos] = useState([])
  const [events, setEvents] = useState([])
  const [form, setForm] = useState(initialForm)
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [videoToDelete, setVideoToDelete] = useState(null)

  useEffect(() => {
    fetchVideos()
    fetchEvents()
  }, [])

  async function fetchVideos() {
    const { data, error } = await supabase.from('videos').select()
    if (!error) setVideos(data || [])
    else console.error(error)
  }

  async function fetchEvents() {
    const { data, error } = await supabase.from('events').select()
    if (!error) setEvents(data || [])
  }

  async function handleAddOrUpdate(e) {
    e.preventDefault()
    setLoading(true)
    setError('')

    let uploadedUrlImportee = ''

    if (file) {
      const fileExt = file.name.split('.').pop()
      const fileName = `${uuidv4()}.${fileExt}`
      const { data, error: uploadError } = await supabase
        .storage
        .from('videos')
        .upload(fileName, file)

      if (uploadError) {
        setError('Erreur lors de l’upload du fichier : ' + uploadError.message)
        setLoading(false)
        return
      }

      const { data: publicUrlData } = supabase
        .storage
        .from('videos')
        .getPublicUrl(fileName)

      uploadedUrlImportee = publicUrlData?.publicUrl || ''
    }

    const toInsert = {
      ...form,
      url_importee: uploadedUrlImportee,
      event_id: form.event_id || null,
      uploaded_at: new Date().toISOString(),
      url: form.url || ''
    }

    if (editingId) {
      const { error: updateError } = await supabase
        .from('videos')
        .update(toInsert)
        .eq('id', editingId)

      if (updateError) {
        setError(updateError.message)
        setLoading(false)
        return
      }
    } else {
      const { error: insertError } = await supabase
        .from('videos')
        .insert([toInsert])

      if (insertError) {
        setError(insertError.message)
        setLoading(false)
        return
      }
    }

    setForm(initialForm)
    setEditingId(null)
    setFile(null)
    setLoading(false)
    fetchVideos()
  }

  async function handleDelete(id) {
    // Récupère l'url_importee de la vidéo avant suppression
    const { data: videoData, error: fetchError } = await supabase
      .from('videos')
      .select('url_importee')
      .eq('id', id)
      .single()

    if (fetchError) {
      console.error('Erreur récupération vidéo :', fetchError)
      return
    }

    if (videoData?.url_importee) {
      const urlImportee = videoData.url_importee
      const parts = urlImportee.split('/videos/')
      
      if (parts.length === 2) {
        const fileName = parts[1].split('?')[0] // Supprimer tout ce qui suit "?" s'il y en a
        console.log('Suppression du fichier :', fileName)

        const { error: storageError } = await supabase
          .storage
          .from('videos')
          .remove([fileName])

        if (storageError) {
          console.error('Erreur suppression fichier storage :', storageError)
        } else {
          console.log('Fichier supprimé du storage avec succès.')
        }
      } else {
        console.warn('Format de URL incorrect, impossible d’extraire le nom du fichier.')
      }
    }

    // Supprime l'enregistrement dans la table
    const { error: deleteError } = await supabase
      .from('videos')
      .delete()
      .eq('id', id)

    if (deleteError) {
      console.error('Erreur suppression enregistrement :', deleteError)
    }

    setShowModal(false)
    fetchVideos()
  }

  function handleEdit(video) {
    setEditingId(video.id)
    setForm({
      titre: video.titre || '',
      description: video.description || '',
      url: video.url || '',
      url_importee: video.url_importee || '',
      event_id: video.event_id || ''
    })
    setFile(null)
  }

  function handleCancelEdit() {
    setForm(initialForm)
    setEditingId(null)
    setFile(null)
    setError('')
  }

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Vidéos</h2>

      <form onSubmit={handleAddOrUpdate} className="mb-8 flex flex-col gap-3">
        <input
          placeholder="Titre"
          value={form.titre}
          onChange={e => setForm(f => ({ ...f, titre: e.target.value }))}
          required
          className="border border-gray-300 rounded-md px-4 py-2"
        />
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
          required
          className="border border-gray-300 rounded-md px-4 py-2"
        />
        <input
          placeholder="URL de la vidéo (YouTube, Vimeo...)"
          value={form.url}
          onChange={e => setForm(f => ({ ...f, url: e.target.value }))}
          className="border border-gray-300 rounded-md px-4 py-2"
        />
        <div>
  <label className="text-gray-700 font-medium mb-1 block"> Importer une vidéo</label>
  {/* Input file caché */}
  <input
    type="file"
    accept="video/*"
    onChange={e => setFile(e.target.files?.[0] || null)}
    className="hidden"
    id="fileInput"
  />
  {/* Bouton personnalisé */}
  <button
    type="button"
    onClick={() => document.getElementById('fileInput').click()}
    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-md"
  >
    Choisir une vidéo
  </button>
  {/* Affiche le nom du fichier sélectionné (optionnel) */}
  {file && <p className="mt-2 text-gray-700">Fichier sélectionné : {file.name}</p>}
</div>

        <label className="text-gray-700 font-medium">Événement lié (optionnel)</label>
        <select
          value={form.event_id}
          onChange={e => setForm(f => ({ ...f, event_id: e.target.value }))}
          className="border border-gray-300 rounded-md px-4 py-2"
        >
          <option value="">Aucun</option>
          {events.map(event => (
            <option key={event.id} value={event.id}>
              {event.titre}
            </option>
          ))}
        </select>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-700 hover:bg-blue-800 text-white font-semibold px-6 py-2 rounded-md"
          >
            {editingId ? (loading ? 'Mise à jour...' : 'Mettre à jour') : (loading ? 'Ajout...' : 'Ajouter')}
          </button>






          {editingId && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="bg-gray-400 hover:bg-gray-500 text-white font-semibold px-6 py-2 rounded-md"
            >
              Annuler
            </button>

          )}
</div>




        {error && <div className="text-red-600">{error}</div>}
      </form>

      <table className="w-full border border-gray-300 rounded-md">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-3 px-4 text-left">Titre</th>
            <th className="py-3 px-4 text-left">Description</th>
            <th className="py-3 px-4 text-left">URL</th>
            <th className="py-3 px-4 text-left">Événement</th>
            <th className="py-3 px-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {videos.map(video => (
            <tr key={video.id} className="border-t border-gray-200 hover:bg-gray-50">
              <td className="py-2 px-4">{video.titre}</td>
              <td className="py-2 px-4">{video.description}</td>
              <td className="py-2 px-4 text-blue-600 flex flex-col gap-1">
                {video.url && (
                  <a href={video.url} target="_blank" rel="noopener noreferrer" className="underline">
                    Lien vers URL
                  </a>
                )}
                {video.url_importee && (
                 <a href={`/videos/${video.id}`} className="underline text-blue-600 hover:text-blue-800">
  Voir vidéo
</a>

                )}
              </td>
              <td className="py-2 px-4">
                {events.find(e => e.id === video.event_id)?.titre || '—'}
              </td>
              <td className="py-2 px-4 flex flex-col gap-2">
                <button
                  onClick={() => handleEdit(video)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-1 rounded-md mb-1"
                >
                  Modifier
                </button>
                <button
                  onClick={() => {
                    setVideoToDelete(video)
                    setShowModal(true)
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded-md"
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ConfirmModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={() => handleDelete(videoToDelete.id)}
      >
        Supprimer la vidéo <span className="font-semibold">{videoToDelete?.titre}</span> ?
      </ConfirmModal>
    </div>
  )
}
