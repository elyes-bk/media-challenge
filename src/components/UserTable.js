'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import ConfirmModal from './ConfirmModal'

export default function UserTable() {
  const [users, setUsers] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [userToDelete, setUserToDelete] = useState(null)
  const [editingUser, setEditingUser] = useState(null)
  const [form, setForm] = useState({ surnom: '', email: '', password: '', theme: false, role: false })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchUsers()
  }, [])

  async function fetchUsers() {
    const { data, error } = await supabase.from('users').select()
    if (!error) setUsers(data || [])
  }

  async function handleAdd(e) {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    if (editingUser) {
      // ============ MODE MODIFICATION ============
      const { error } = await supabase
        .from('users')
        .update({
          surnom: form.surnom,
          theme: form.theme,
          role: form.role
        })
        .eq('id', editingUser.id)

      if (error) {
        setMessage("Erreur lors de la modification : " + error.message)
      } else {
        setMessage("Utilisateur modifié !")
        setEditingUser(null)
        setForm({ surnom: '', email: '', password: '', theme: false, role: false })
        fetchUsers()
      }

      setLoading(false)
      return
    }

    // ============ MODE AJOUT ============
    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          surnom: form.surnom,
          theme: form.theme,
          role: form.role
        }
      }
    })
    if (error) {
      setMessage("Erreur lors de l'ajout : " + error.message)
      setLoading(false)
      return
    }

    const insertResult = await supabase.from('users').insert({
      id: data.user.id,
      surnom: form.surnom,
      email: form.email,
      role: form.role,
      theme: form.theme
    });

    setMessage("Utilisateur ajouté ! (Vérifie l'email pour confirmation)")
    setForm({ surnom: '', email: '', password: '', theme: false, role: false })
    setLoading(false)
    fetchUsers()
  }

  async function handleDelete(id) {
    const res = await fetch('/api/delete-user', {
      method: 'POST',
      body: JSON.stringify({ id }),
      headers: { 'Content-Type': 'application/json' }
    })

    const result = await res.json()

    if (!res.ok) {
      setMessage("Erreur lors de la suppression : " + result.error)
      return
    }

    setShowModal(false)
    fetchUsers()
  }

  function startEdit(user) {
    setEditingUser(user)
    setForm({
      surnom: user.surnom,
      email: user.email,
      password: '', // non modifiable ici
      theme: user.theme,
      role: user.role
    })
  }

  function cancelEdit() {
    setEditingUser(null)
    setForm({ surnom: '', email: '', password: '', theme: false, role: false })
  }

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Utilisateurs</h2>

      {/* Formulaire Ajout/Modification */}
      <form onSubmit={handleAdd} className="mb-8 flex flex-col gap-3">
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
          required
          className="border border-gray-300 rounded-md px-4 py-2"
          disabled={!!editingUser} // désactiver l'email si modification
        />
        <input
          type="text"
          placeholder="Surnom"
          value={form.surnom}
          onChange={e => setForm(f => ({ ...f, surnom: e.target.value }))}
          required
          className="border border-gray-300 rounded-md px-4 py-2"
        />
        {!editingUser && (
          <input
            type="password"
            placeholder="Mot de passe"
            value={form.password}
            onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
            required
            className="border border-gray-300 rounded-md px-4 py-2"
          />
        )}
        <select
          value={form.theme}
          onChange={e => setForm(f => ({ ...f, theme: e.target.value === "true" }))}
          className="border border-gray-300 rounded-md px-4 py-2"
        >
          <option value={false}>Thème clair</option>
          <option value={true}>Thème sombre</option>
        </select>
        <select
          value={form.role}
          onChange={e => setForm(f => ({ ...f, role: e.target.value === "true" }))}
          className="border border-gray-300 rounded-md px-4 py-2"
        >
          <option value={false}>Utilisateur</option>
          <option value={true}>Admin</option>
        </select>
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-700 hover:bg-blue-800 text-white font-semibold px-6 py-2 rounded-md"
          >
            {loading ? (editingUser ? "Modification..." : "Ajout...") : (editingUser ? "Modifier" : "Ajouter")}
          </button>
          {editingUser && (
            <button
              type="button"
              onClick={cancelEdit}
              className="bg-gray-400 hover:bg-gray-500 text-white font-semibold px-6 py-2 rounded-md"
            >
              Annuler
            </button>
          )}
        </div>
        {message && (
          <div className="text-sm text-red-600 mt-2">{message}</div>
        )}
      </form>

      {/* Tableau */}
      <table className="w-full border border-gray-300 rounded-md">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-3 px-6 text-left text-gray-800">Email</th>
            <th className="py-3 px-6 text-left text-gray-800">Surnom</th>
            <th className="py-3 px-6 text-left text-gray-800">Theme</th>
            <th className="py-3 px-6 text-left text-gray-800">Role</th>
            <th className="py-3 px-6 text-left text-gray-800">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id} className="border-t border-gray-200 hover:bg-gray-50">
              <td className="py-3 px-6 text-gray-900">{u.email}</td>
              <td className="py-3 px-6 text-gray-900">{u.surnom}</td>
              <td className="py-3 px-6 text-gray-900">{u.theme ? "Sombre" : "Clair"}</td>
              <td className="py-3 px-6 text-gray-900">{u.role ? "Admin" : "Utilisateur"}</td>
              <td className="py-3 px-6 flex gap-2">
                <button
                  onClick={() => startEdit(u)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-1 rounded-md"
                >
                  Modifier
                </button>
                <button
                  onClick={() => { setUserToDelete(u); setShowModal(true); }}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded-md"
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal Confirmation */}
      <ConfirmModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={() => handleDelete(userToDelete.id)}
      >
        Supprimer l'utilisateur <span className="font-semibold">{userToDelete?.email}</span> ?
      </ConfirmModal>
    </div>
  )
}
