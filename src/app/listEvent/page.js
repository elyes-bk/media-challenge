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
    <div className="min-h-screen bg-[#F4EDDE] dark:bg-[#23221f] px-4 py-6 transition-colors duration-300">
      <h1 className="text-xl font-bold text-[#23221f] dark:text-white mb-6">Notifications</h1>

      {/* Section Événements */}
      <div className="mb-6">
        <h2 className="text-md font-semibold text-[#23221f] dark:text-white mb-4">Événements</h2>
        <ul className="space-y-4">
          {filteredEvents
            .sort((a,b) => new Date(b.created_at) - new Date(a.created_at))
            .map(ev => (
           <li key={ev.id} className="flex items-center gap-4">
              {/* Texte à gauche */}
              <div className="flex-1">
                <p className="font-bold text-[#23221f] dark:text-white text-sm">{ev.titre}</p>
                <p className="text-xs text-[#23221f] dark:text-[#bbb]">{ev.description}</p>
              </div>

              {/* Image à droite */}
              <div className="w-1/2 flex justify-center">
                <img
                  src={ev.image_url}
                  alt="Illustration"
                  className="object-cover rounded-lg h-30"
                />
              </div>
            </li>

          ))}
        </ul>
      </div>  
    </div>
  )
}
