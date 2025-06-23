'use client';

import { useState, useEffect } from 'react';

export default function AdminDashboard() {
  const [events, setEvents] = useState([]);
  const [videos, setVideos] = useState([]);
  const [admin, setAdmin] = useState({
    name: 'Admin User',
    email: 'admin@example.com',
    theme: 'clair',
    password: 'secret123',
  });

  useEffect(() => {
    const savedEvents = localStorage.getItem('admin_events');
    const savedVideos = localStorage.getItem('admin_videos');
    const savedAdmin = localStorage.getItem('admin_profile');

    if (savedEvents) setEvents(JSON.parse(savedEvents));
    if (savedVideos) setVideos(JSON.parse(savedVideos));
    if (savedAdmin) setAdmin(JSON.parse(savedAdmin));
  }, []);

  useEffect(() => {
    localStorage.setItem('admin_events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('admin_videos', JSON.stringify(videos));
  }, [videos]);

  useEffect(() => {
    localStorage.setItem('admin_profile', JSON.stringify(admin));
  }, [admin]);

  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState(admin);

  const saveProfile = (e) => {
    e.preventDefault();
    setAdmin(profileForm);
    setEditingProfile(false);
  };

  const [showEventForm, setShowEventForm] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    lieu: '',
    startDate: '',
    endDate: '',
    address: '',
  });
  const [editingEventId, setEditingEventId] = useState(null);
  const [eventForm, setEventForm] = useState(newEvent);

  const handleAddEvent = (e) => {
    e.preventDefault();
    setEvents([...events, { id: Date.now(), ...newEvent }]);
    setNewEvent({ title: '', description: '', lieu: '', startDate: '', endDate: '', address: '' });
    setShowEventForm(false);
  };

  const startEditEvent = (id) => {
    const evt = events.find((e) => e.id === id);
    if (!evt) return;
    setEventForm(evt);
    setEditingEventId(id);
  };

  const saveEditedEvent = (e) => {
    e.preventDefault();
    setEvents(events.map((evt) => (evt.id === editingEventId ? eventForm : evt)));
    setEditingEventId(null);
    setEventForm(newEvent);
  };

  const cancelEditEvent = () => {
    setEditingEventId(null);
    setEventForm(newEvent);
  };

  const deleteEvent = (id) => setEvents(events.filter((e) => e.id !== id));

  const [showVideoForm, setShowVideoForm] = useState(false);
  const [newVideo, setNewVideo] = useState({
    title: '',
    type: '',
    description: '',
    lieu: '',
    url: '',
  });
  const [editingVideoId, setEditingVideoId] = useState(null);
  const [videoForm, setVideoForm] = useState(newVideo);

  const handleAddVideo = (e) => {
    e.preventDefault();
    setVideos([...videos, { id: Date.now(), ...newVideo }]);
    setNewVideo({ title: '', type: '', description: '', lieu: '', url: '' });
    setShowVideoForm(false);
  };

  const startEditVideo = (id) => {
    const vid = videos.find((v) => v.id === id);
    if (!vid) return;
    setVideoForm(vid);
    setEditingVideoId(id);
  };

  const saveEditedVideo = (e) => {
    e.preventDefault();
    setVideos(videos.map((v) => (v.id === editingVideoId ? videoForm : v)));
    setEditingVideoId(null);
    setVideoForm(newVideo);
  };

  const cancelEditVideo = () => {
    setEditingVideoId(null);
    setVideoForm(newVideo);
  };

  const deleteVideo = (id) => setVideos(videos.filter((v) => v.id !== id));

  return (
    <main className="bg-gray-100 min-h-screen p-8 text-black">
      <div className="max-w-5xl mx-auto space-y-10">
        <h1 className="text-3xl font-bold text-center text-indigo-700">Espace Administrateur</h1>




        {/* Profil */}
        <section className="bg-white rounded-xl shadow p-6 text-black">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">👤 Profil Admin</h2>
          {!editingProfile ? (
            <>
              <p><strong>Nom :</strong> {admin.name}</p>
              <p><strong>Email :</strong> {admin.email}</p>
              <p><strong>Thème :</strong> {admin.theme}</p>
              <p><strong>Mot de passe :</strong> {'*'.repeat(admin.password.length)}</p>
              <button
                onClick={() => {
                  setProfileForm(admin);
                  setEditingProfile(true);
                }}
                className="mt-4 bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded"
              >
                ✏️ Modifier le profil
              </button>
            </>
          ) : (
            <form onSubmit={saveProfile} className="space-y-4">
              <input
                type="text"
                value={profileForm.name}
                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                placeholder="Nom"
                required
                className="w-full p-2 border rounded text-black"
              />
              <input
                type="email"
                value={profileForm.email}
                onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                placeholder="Email"
                required
                className="w-full p-2 border rounded"
              />
              <select
                value={profileForm.theme}
                onChange={(e) => setProfileForm({ ...profileForm, theme: e.target.value })}
                required
                className="w-full p-2 border rounded text-black"
              >
                <option value="clair">Clair</option>
                <option value="sombre">Sombre</option>
              </select>
              <input
                type="password"
                value={profileForm.password}
                onChange={(e) => setProfileForm({ ...profileForm, password: e.target.value })}
                placeholder="Mot de passe"
                required
                className="w-full p-2 border rounded text-black"
              />
              <div className="flex space-x-4">
                <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
                  💾 Sauvegarder
                </button>
                <button
                  type="button"
                  onClick={() => setEditingProfile(false)}
                  className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Annuler
                </button>
              </div>
            </form>
          )}
        </section>

      
        {/* Vidéos */}
        <section className="bg-white rounded-xl shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-800">🎥 Vidéos</h2>
            <button
              onClick={() => {
                setShowVideoForm(!showVideoForm);
                setEditingVideoId(null); // désactiver édition
              }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
            >
              {showVideoForm ? 'Annuler' : '➕ Ajouter'}
            </button>
          </div>

          {/* Formulaire ajout */}
          {showVideoForm && !editingVideoId && (
            <form onSubmit={handleAddVideo} className="bg-gray-50 p-4 rounded-lg mb-6 space-y-4">
              <input className="w-full p-2 border rounded" placeholder="Titre" required
                value={newVideo.title} onChange={e => setNewVideo({ ...newVideo, title: e.target.value })} />
              <input className="w-full p-2 border rounded" placeholder="Type" required
                value={newVideo.type} onChange={e => setNewVideo({ ...newVideo, type: e.target.value })} />
              <textarea className="w-full p-2 border rounded" placeholder="Description" required
                value={newVideo.description} onChange={e => setNewVideo({ ...newVideo, description: e.target.value })} />
              <input className="w-full p-2 border rounded" placeholder="Lieu" required
                value={newVideo.lieu} onChange={e => setNewVideo({ ...newVideo, lieu: e.target.value })} />
              <input className="w-full p-2 border rounded" placeholder="URL" required
                value={newVideo.url} onChange={e => setNewVideo({ ...newVideo, url: e.target.value })} />
              <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
                ✅ Enregistrer
              </button>
            </form>
          )}

          {/* Formulaire modification */}
          {editingVideoId && (
            <form onSubmit={saveEditedVideo} className="bg-gray-50 p-4 rounded-lg mb-6 space-y-4">
              <input className="w-full p-2 border rounded" placeholder="Titre" required
                value={videoForm.title} onChange={e => setVideoForm({ ...videoForm, title: e.target.value })} />
              <input className="w-full p-2 border rounded" placeholder="Type" required
                value={videoForm.type} onChange={e => setVideoForm({ ...videoForm, type: e.target.value })} />
              <textarea className="w-full p-2 border rounded" placeholder="Description" required
                value={videoForm.description} onChange={e => setVideoForm({ ...videoForm, description: e.target.value })} />
              <input className="w-full p-2 border rounded" placeholder="Lieu" required
                value={videoForm.lieu} onChange={e => setVideoForm({ ...videoForm, lieu: e.target.value })} />
              <input className="w-full p-2 border rounded" placeholder="URL" required
                value={videoForm.url} onChange={e => setVideoForm({ ...videoForm, url: e.target.value })} />
              <div className="flex space-x-4">
                <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
                  💾 Sauvegarder
                </button>
                <button type="button" onClick={cancelEditVideo} className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded">
                  Annuler
                </button>
              </div>
            </form>
          )}

          <ul className="space-y-4">
            {videos.map(vid => (
              <li key={vid.id} className="border rounded-lg p-4 bg-gray-50 flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-gray-800">{vid.title}</h3>
                  <p><strong>🎞️ Type:</strong> {vid.type}</p>
                  <p><strong>📝 Description:</strong> {vid.description}</p>
                  <p><strong>📍 Lieu:</strong> {vid.lieu}</p>
                  <a href={vid.url} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">Voir la vidéo</a>
                </div>
                <div className="space-x-2">
                  <button onClick={() => startEditVideo(vid.id)} className="px-3 py-1 text-sm bg-yellow-400 rounded">✏️</button>
                  <button onClick={() => deleteVideo(vid.id)} className="px-3 py-1 text-sm bg-red-500 text-white rounded">🗑️</button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
