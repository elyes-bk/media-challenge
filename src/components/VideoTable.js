'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { v4 as uuidv4 } from 'uuid'
import ConfirmModal from './ConfirmModal'

const initialForm = {
  titre: '',
  description: '',
  url: '',
  url_importee: ''
}

export default function VideoTable() {
  const [videos, setVideos] = useState([])
  const [form, setForm] = useState(initialForm)
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [videoToDelete, setVideoToDelete] = useState(null)

  useEffect(() => {
    fetchVideos()
  }, [])

  async function fetchVideos() {
    const { data, error } = await supabase.from('videos').select().order('uploaded_at', { ascending: false })
    if (!error) setVideos(data || [])
    else console.error(error)
  }

  async function handleAddOrUpdate(e) {
    e.preventDefault()
    setLoading(true)
    setError('')

    let uploadedUrlImportee = form.url_importee

    if (file) {
      const fileExt = file.name.split('.').pop()
      const fileName = `${uuidv4()}.${fileExt}`
      const { error: uploadError } = await supabase.storage.from('videos').upload(fileName, file)

      if (uploadError) {
        setError('Erreur lors de l’upload : ' + uploadError.message)
        setLoading(false)
        return
      }

      const { data: publicUrlData } = supabase.storage.from('videos').getPublicUrl(fileName)
      uploadedUrlImportee = publicUrlData?.publicUrl || ''
    }

    const toInsert = {
      titre: form.titre,
      description: form.description,
      url: form.url || '',
      url_importee: uploadedUrlImportee,
      uploaded_at: new Date().toISOString()
    }

    if (editingId) {
      const { error: updateError } = await supabase.from('videos').update(toInsert).eq('id', editingId)
      if (updateError) {
        setError(updateError.message)
        setLoading(false)
        return
      }
    } else {
      const { error: insertError } = await supabase.from('videos').insert([toInsert])
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
    const { data: videoData } = await supabase.from('videos').select('url_importee').eq('id', id).single()
    const urlImportee = videoData?.url_importee

    if (urlImportee) {
      const parts = urlImportee.split('/videos/')
      if (parts.length === 2) {
        const fileName = parts[1].split('?')[0]
        await supabase.storage.from('videos').remove([fileName])
      }
    }

    await supabase.from('videos').delete().eq('id', id)
    setShowModal(false)
    fetchVideos()
  }

  function handleEdit(video) {
    setEditingId(video.id)
    setForm({
      titre: video.titre || '',
      description: video.description || '',
      url: video.url || '',
      url_importee: video.url_importee || ''
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
          placeholder="URL externe (YouTube, Vimeo...)"
          value={form.url}
          onChange={e => setForm(f => ({ ...f, url: e.target.value }))}
          className="border border-gray-300 rounded-md px-4 py-2"
        />
        <div>
          <label className="text-gray-700 font-medium mb-1 block">Importer une vidéo</label>
          <input
            type="file"
            accept="video/*"
            onChange={e => setFile(e.target.files?.[0] || null)}
            className="hidden"
            id="fileInput"
          />
          <button
            type="button"
            onClick={() => document.getElementById('fileInput').click()}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-md"
          >
            Choisir une vidéo
          </button>
          {file && <p className="mt-2 text-gray-700">Fichier sélectionné : {file.name}</p>}
        </div>

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
            <th className="py-3 px-4 text-left">Vidéo</th>
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
                    Lien externe
                  </a>
                )}
                {video.url_importee && (
                  <a href={`/videos/${video.id}`} className="underline text-blue-600 hover:text-blue-800">
                    Voir vidéo
                  </a>
                )}
              </td>
              <td className="py-2 px-4 flex flex-col gap-2">
                <button
                  onClick={() => handleEdit(video)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-1 rounded-md"
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
