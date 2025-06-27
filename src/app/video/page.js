'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'

export default function AllVideosPage() {
  const [videos, setVideos] = useState([])

  useEffect(() => {
    const fetchVideos = async () => {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .order('uploaded_at', { ascending: false })

      if (!error) setVideos(data || [])
    }

    fetchVideos()
  }, [])

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Toutes les vidéos</h1>

      <div className="grid md:grid-cols-2 gap-6">
        {videos.map(video => (
          <div key={video.id} className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-xl font-semibold mb-2">{video.titre}</h2>
            {video.url_importee && (
              <video
                className="w-full rounded-md mb-2"
                src={video.url_importee}
                controls
              />
            )}
            <p className="text-gray-700 mb-2">{video.description}</p>
            <Link href={`/videos/${video.id}`}>
              <span className="text-blue-600 underline text-sm">Voir plus</span>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
