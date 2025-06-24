'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { filterEventsByCategory } from '../../utils/filters'

export default function ListEvent() {
  const [events, setEvents] = useState([])
  const [categories, setCategories] = useState([])
  const [eventCategories, setEventCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('all')

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

  const filteredEvents = filterEventsByCategory(events, eventCategories, selectedCategory)

  return (
    <div className="min-h-screen bg-[#F4EDDE] px-4 py-6">
      <h1 className="text-xl font-bold text-[#23221f] mb-6">Notifications</h1>

      {/* Section Événements */}
      <div className="mb-6">
        <h2 className="text-md font-semibold text-[#23221f] mb-4">Événements</h2>
        <ul className="space-y-4">
          {filteredEvents.slice(0, 2).map(ev => (
            <li key={ev.id} className="flex justify-between items-start">
              <div className="flex-1 pr-4">
                <p className="font-bold text-[#23221f] text-sm">{ev.titre}</p>
                <p className="text-xs text-[#23221f]">{ev.description}</p>
              </div>
              <div className="w-12 h-12 bg-[#179a9c] rounded-md shrink-0"></div>
            </li>
          ))}
        </ul>
      </div>

      {/* Section Vidéos (même contenu ici en démo) */}
      <div>
        <h2 className="text-md font-semibold text-[#23221f] mb-4">Vidéos</h2>
        <ul className="space-y-4">
          {filteredEvents.slice(2).map(ev => (
            <li key={ev.id} className="flex justify-between items-start">
              <div className="flex-1 pr-4">
                <p className="font-bold text-[#23221f] text-sm">{ev.titre}</p>
                <p className="text-xs text-[#23221f]">{ev.description}</p>
              </div>
              <div className="w-12 h-12 bg-[#179a9c] rounded-md shrink-0"></div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
