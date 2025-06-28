'use client'
import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { supabase } from '@/lib/supabaseClient'
import { filterEventsByCategory } from '@/utils/filters' // <-- Ajout

// ⚠️ Important : on désactive le SSR pour ce composant
const InteractiveMap = dynamic(() => import('@/components/InteractiveMap'), {
  ssr: false,
})

export default function EventsPage() {
  const [events, setEvents] = useState([])
  const [categories, setCategories] = useState([])
  const [eventCategories, setEventCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [focusedEvent, setFocusedEvent] = useState(null)

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

  // Remplacer la logique de filtrage par l'appel à la fonction utilitaire
  const filteredEvents = filterEventsByCategory(events, eventCategories, selectedCategory);

  return (
    <div className="max-w-5xl mx-auto">
      {/* Select de catégorie */}
      {/*
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
      </div>*/}
      <InteractiveMap
        events={filteredEvents}
        focusedEvent={focusedEvent}
      />
    </div>
  )
}
