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
    <div className={`absolute bottom-0 left-0 right-0 h-[90%] z-500 bg-white rounded-t-2xl p-4 shadow-xl transform transition-transform duration-300 ease-in-out ${
        visible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="flex flex-col gap-2">
        {/* Titre */}
        <h2 className="text-lg font-bold">{event.titre}</h2>
        {/* Description */}
        <p className="text-sm text-gray-700">{event.description}</p>

        {/* Bouton Fermer */}
        <button
          onClick={onClose}
          className="mt-4 self-start bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Fermer
        </button>
      </div>
    </div>
  )
}
