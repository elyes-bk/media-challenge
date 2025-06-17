'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import ConfirmModal from './ConfirmModal'

export default function EventTable() {
  const [events, setEvents] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [eventToDelete, setEventToDelete] = useState(null)
  const [form, setForm] = useState({ titre: '', description: '' })

  useEffect(() => {
    fetchEvents()
  }, [])

  async function fetchEvents() {
    const { data } = await supabase.from('events').select()
    setEvents(data || [])
  }

  async function handleAdd(e) {
    e.preventDefault()
    await supabase.from('events').insert([form])
    setForm({ titre: '', description: '' })
    fetchEvents()
  }

  async function handleDelete(id) {
    await supabase.from('events').delete().eq('id', id)
    setShowModal(false)
    fetchEvents()
  }

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Événements</h2>
      <table className="w-full border border-gray-300 rounded-md">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-3 px-6 text-left text-gray-800">Titre</th>
            <th className="py-3 px-6 text-left text-gray-800">Description</th>
            <th className="py-3 px-6 text-left text-gray-800">Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.map(ev => (
            <tr key={ev.id} className="border-t border-gray-200 hover:bg-gray-50">
              <td className="py-3 px-6 text-gray-900">{ev.titre}</td>
              <td className="py-3 px-6 text-gray-900">{ev.description}</td>
              <td className="py-3 px-6">
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
      <form onSubmit={handleAdd} className="mt-6 flex flex-col gap-3">
        <input
          placeholder="Titre"
          value={form.titre}
          onChange={e => setForm(f => ({ ...f, titre: e.target.value }))}
          required
          className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
        <input
          placeholder="Description"
          value={form.description}
          onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
          required
          className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
        <button
          type="submit"
          className="bg-blue-700 hover:bg-blue-800 text-white font-semibold px-6 py-2 rounded-md transition"
        >
          Ajouter
        </button>
      </form>
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
