'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import InteractiveMap from '@/components/InteractiveMap'

export default function EventsPage() {
  const [events, setEvents] = useState([])
  const [categories, setCategories] = useState([])
  const [eventCategories, setEventCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [focusedEvent, setFocusedEvent] = useState(null) // <--- Ajout

  useEffect(() => {
    fetchAll()
  }, [])

  async function fetchAll() {
    const { data: eventsData } = await supabase.from('events').select()
    setEvents(eventsData || [])
    const { data: categoriesData } = await supabase.from('categories').select()
    setCategories(categoriesData || [])
    const { data: eventCategoriesData } = await supabase.from('event_categories').select()
    setEventCategories(eventCategoriesData || [])
  }

  const filteredEvents = selectedCategory === 'all'
    ? events
    : events.filter(ev =>
        eventCategories.some(ec =>
          ec.event_id === ev.id && ec.category_id === selectedCategory
        )
      )

  return (
    <div className="max-w-5xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6 text-white-900">Événements</h1>
      {/* Select de catégorie */}
      <div className="mb-6">
        <label htmlFor="category-select" className="mr-2 font-semibold">Filtrer par catégorie :</label>
        <select
          id="category-select"
          value={selectedCategory}
          onChange={e => setSelectedCategory(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2"
        >
          <option value="all">Toutes</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.nom}</option>
          ))}
        </select>
      </div>
      <InteractiveMap
        events={filteredEvents}
        proximityRadius={100}
        focusedEvent={focusedEvent}
      />
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Liste des événements</h2>
        <ul>
          {filteredEvents.map(ev => (
            <li
              key={ev.id}
              className="mb-2 cursor-pointer hover:underline"
              onClick={() => setFocusedEvent(ev)}
            >
              <span className="font-bold">{ev.titre}</span> — {ev.description}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
