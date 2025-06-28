'use client'
import { useEffect, useState } from 'react'

export default function SwipePopUp({ event, onClose }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (event) setVisible(true)
    else setVisible(false)
  }, [event])

  if (!event) return null

  return (
    <div className={`absolute bottom-0 left-0 right-0 h-[90%] bg-[#F4EDDE] z-500 rounded-t-2xl p-4 shadow-xl transform transition-transform duration-300 ease-in-out ${
        visible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="flex flex-col gap-2">
        {event.image_url && (
          <img
            src={event.image_url}
            alt="Illustration"
            className="w-full h-40 object-cover rounded-lg mb-2"
          />
        )}

        <h2 className="text-xl font-bold text-gray-900">{event.titre}</h2>
        <p className="text-sm text-gray-700">{event.date_debut}</p>

        <p className="font-semibold text-gray-800">
          {event.personnalite || 'Titre secondaire'}
        </p>
        <p className="text-sm text-gray-800 leading-relaxed">
          {event.description}
        </p>

        {/* Bouton Fermer */}
        <button
          onClick={onClose}
          className="mt-4 w-full bg-teal-700 hover:bg-teal-800 text-white font-semibold py-2 px-4 rounded-lg flex justify-center items-center gap-2"
        >
          Fermer
        </button>
      </div>
    </div>
  )
}
