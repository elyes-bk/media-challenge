'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import ConfirmModal from './ConfirmModal'

const initialForm = {
  titre: '',
  description: '',
  personnalite: '',
  date_debut: '',
  date_fin: '',
  latitude: '',
  longitude: '',
  adresse: '',
  image_url:''
}

export default function EventTable() {
  const [events, setEvents] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCategories, setSelectedCategories] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [eventToDelete, setEventToDelete] = useState(null)
  const [form, setForm] = useState(initialForm)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [imageFile, setImageFile] = useState(null)

  useEffect(() => {
    fetchEvents()
    fetchCategories()
  }, [])

  async function fetchEvents() {
    const { data, error } = await supabase.from('events').select()
    if (!error) setEvents(data || [])
  }

  async function fetchCategories() {
    const { data, error } = await supabase.from('categories').select()
    if (!error) setCategories(data || [])
  }

  async function fetchEventCategories(eventId) {
    const { data, error } = await supabase
      .from('event_categories')
      .select('category_id')
      .eq('event_id', eventId)
    if (!error) return data.map(row => row.category_id)
    return []
  }

  //televerser une image
  async function uploadImage(imageFile) {
    if (!imageFile) return null

    const fileExt = imageFile.name.split('.').pop()
    const fileName = `${Date.now()}.${fileExt}`
    const filePath = `events/${fileName}`

    const { error: uploadError } = await supabase
      .storage
      .from('event-images') // le nom de ton bucket
      .upload(filePath, imageFile)

    if (uploadError) {
      throw new Error(uploadError.message)
    }

    const { data } = supabase
      .storage
      .from('event-images')
      .getPublicUrl(filePath)

    return data.publicUrl
  }

  async function handleAddOrUpdate(e) {
    e.preventDefault()
    setLoading(true)
    setError('')

    let imageUrl = form.image_url || null // utile pour les updates
    
    const {
      imageFile, // on l’enlève de ce qui sera envoyé
      ...restForm
    } = form

    if (imageFile) {
      try {
        imageUrl = await uploadImage(imageFile)
      } catch (uploadErr) {
        setError(uploadErr.message)
        setLoading(false)
        return
      }
    }

    const toInsert = {
      ...restForm,
      latitude: form.latitude !== '' ? parseFloat(form.latitude) : null,
      longitude: form.longitude !== '' ? parseFloat(form.longitude) : null,
      date_debut: form.date_debut !== '' ? form.date_debut : null,
      date_fin: form.date_fin !== '' ? form.date_fin : null,
      image_url: imageUrl
    }

    if (editingId) {
      // Update event
      const { error: updateError } = await supabase
        .from('events')
        .update(toInsert)
        .eq('id', editingId)
      if (updateError) {
        setError(updateError.message)
        setLoading(false)
        return
      }
      // Update event_categories: delete old, insert new
      await supabase.from('event_categories').delete().eq('event_id', editingId)
      if (selectedCategories.length > 0) {
        const eventCategories = selectedCategories.map(catId => ({
          event_id: editingId,
          category_id: catId
        }))
        const { error: linkError } = await supabase
          .from('event_categories')
          .insert(eventCategories)
        if (linkError) {
          setError(linkError.message)
          setLoading(false)
          return
        }
      }
    } else {
      // Insert event
      const { data: eventData, error: eventError } = await supabase
        .from('events')
        .insert([toInsert])
        .select()
        .single()
      if (eventError) {
        setError(eventError.message)
        setLoading(false)
        return
      }
      if (selectedCategories.length > 0) {
        const eventCategories = selectedCategories.map(catId => ({
          event_id: eventData.id,
          category_id: catId
        }))
        const { error: linkError } = await supabase
          .from('event_categories')
          .insert(eventCategories)
        if (linkError) {
          setError(linkError.message)
          setLoading(false)
          return
        }
      }
    }

    setForm(initialForm)
    setSelectedCategories([])
    setEditingId(null)
    setLoading(false)
    fetchEvents()
  }

  async function handleDelete(id) {
    await supabase.from('events').delete().eq('id', id)
    await supabase.from('event_categories').delete().eq('event_id', id)
    setShowModal(false)
    fetchEvents()
  }

  async function handleEdit(event) {
    setEditingId(event.id)
    setForm({
      titre: event.titre || '',
      description: event.description || '',
      personnalite: event.personnalite || '',
      date_debut: event.date_debut ? event.date_debut.slice(0, 16) : '',
      date_fin: event.date_fin ? event.date_fin.slice(0, 16) : '',
      latitude: event.latitude || '',
      longitude: event.longitude || '',
      adresse: event.adresse || '',
      image_url: event.image_url || ''
    })
    setImageFile(null)
    const cats = await fetchEventCategories(event.id)
    setSelectedCategories(cats.map(String))
  }

  function handleCancelEdit() {
    setForm(initialForm)
    setSelectedCategories([])
    setEditingId(null)
    setError('')
  }

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Événements</h2>
      {/* Formulaire d'ajout/modification */}
      <form onSubmit={handleAddOrUpdate} className="mb-8 flex flex-col gap-3">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setForm({ ...form, imageFile: e.target.files[0] })}
        />
        {imageFile && (
          <img
            src={URL.createObjectURL(imageFile)}
            alt="Aperçu"
            className="w-24 h-24 object-cover rounded border"
          />
        )}

{!imageFile && form.image_url && (
  <img
    src={form.image_url}
    alt="Image existante"
    className="w-24 h-24 object-cover rounded border"
  />
)}

        <input
          placeholder="Titre"
          value={form.titre}
          onChange={e => setForm(f => ({ ...f, titre: e.target.value }))}
          required
          className="border border-gray-300 rounded-md px-4 py-2 text-gray-700"
        />
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
          required
          className="border border-gray-300 rounded-md px-4 py-2 text-gray-700"
        />
        <input
          placeholder="Personnalité"
          value={form.personnalite}
          onChange={e => setForm(f => ({ ...f, personnalite: e.target.value }))}
          className="border border-gray-300 rounded-md px-4 py-2 text-gray-700"
        />
        <label className="text-gray-700 font-medium">Date de début</label>
        <input
          type="datetime-local"
          value={form.date_debut}
          onChange={e => setForm(f => ({ ...f, date_debut: e.target.value }))}
          className="border border-gray-300 rounded-md px-4 py-2 text-gray-700"
        />
        <label className="text-gray-700 font-medium">Date de fin</label>
        <input
          type="datetime-local"
          value={form.date_fin}
          onChange={e => setForm(f => ({ ...f, date_fin: e.target.value }))}
          className="border border-gray-300 rounded-md px-4 py-2 text-gray-700"
        />
        <input
          placeholder="Latitude"
          type="number"
          step="any"
          value={form.latitude}
          onChange={e => setForm(f => ({ ...f, latitude: e.target.value }))}
          required
          className="border border-gray-300 rounded-md px-4 py-2 text-gray-700"
        />
        <input
          placeholder="Longitude"
          type="number"
          step="any"
          value={form.longitude}
          onChange={e => setForm(f => ({ ...f, longitude: e.target.value }))}
          required
          className="border border-gray-300 rounded-md px-4 py-2 text-gray-700"
        />
        <input
          placeholder="Adresse"
          value={form.adresse}
          onChange={e => setForm(f => ({ ...f, adresse: e.target.value }))}
          className="border border-gray-300 rounded-md px-4 py-2 text-gray-700"
        />
        <label className="text-gray-700 font-medium">Catégories</label>
        <select
          multiple
          value={selectedCategories}
          onChange={e => {
            const options = Array.from(e.target.selectedOptions, option => option.value)
            setSelectedCategories(options)
          }}
          className="border border-gray-300 rounded-md px-4 py-2 text-gray-700"
        >
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>
              {cat.nom}
            </option>
          ))}
        </select>
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-700 hover:bg-blue-800 text-white font-semibold px-6 py-2 rounded-md"
          >
            {editingId ? (loading ? "Mise à jour..." : "Mettre à jour") : (loading ? "Ajout..." : "Ajouter")}
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
      {/* Tableau des événements */}
      <table className="w-full border border-gray-300 rounded-md">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-3 px-4 text-left text-gray-800">Titre</th>
            <th className="py-3 px-4 text-left text-gray-800">Description</th>
            <th className="py-3 px-4 text-left text-gray-800">Personnalité</th>
            <th className="py-3 px-4 text-left text-gray-800">Début</th>
            <th className="py-3 px-4 text-left text-gray-800">Fin</th>
            <th className="py-3 px-4 text-left text-gray-800">Latitude</th>
            <th className="py-3 px-4 text-left text-gray-800">Longitude</th>
            <th className="py-3 px-4 text-left text-gray-800">Adresse</th>
            <th className="py-3 px-4 text-left text-gray-800">Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.map(ev => (
            <tr key={ev.id} className="border-t border-gray-200 hover:bg-gray-50">
              <td className="py-2 px-4 text-gray-900">{ev.titre}</td>
              <td className="py-2 px-4 text-gray-900">{ev.description}</td>
              <td className="py-2 px-4 text-gray-900">{ev.personnalite}</td>
              <td className="py-2 px-4 text-gray-900">{ev.date_debut ? new Date(ev.date_debut).toLocaleString() : ''}</td>
              <td className="py-2 px-4 text-gray-900">{ev.date_fin ? new Date(ev.date_fin).toLocaleString() : ''}</td>
              <td className="py-2 px-4 text-gray-900">{ev.latitude}</td>
              <td className="py-2 px-4 text-gray-900">{ev.longitude}</td>
              <td className="py-2 px-4 text-gray-900">{ev.adresse}</td>
              <td className="py-2 px-4 flex flex-col gap-2">
                <button
                  onClick={() => handleEdit(ev)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-1 rounded-md transition mb-1"
                >
                  Modifier
                </button>
                <button
                  onClick={() => { setEventToDelete(ev); setShowModal(true); }}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded-md transition"
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
        onConfirm={() => handleDelete(eventToDelete.id)}
      >
        Supprimer l'événement <span className="font-semibold">{eventToDelete?.titre}</span> ?
      </ConfirmModal>
    </div>
  )
}