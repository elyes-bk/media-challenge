'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function VideoPage() {
  const params = useParams()
  const [video, setVideo] = useState(null)
  const [eventTitle, setEventTitle] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchVideo() {
      if (!params?.id) {
        setError('ID vidéo manquant')
        setLoading(false)
        return
      }

      const { data: videoData, error: videoError } = await supabase
        .from('videos')
        .select('*')
        .eq('id', params.id)
        .single()

      if (videoError) {
        setError('Erreur récupération vidéo : ' + videoError.message)
        setLoading(false)
        return
      }

      setVideo(videoData)

      if (videoData?.event_id) {
        const { data: eventData, error: eventError } = await supabase
          .from('events')
          .select('titre')
          .eq('id', videoData.event_id)
          .single()

        if (!eventError && eventData) {
          setEventTitle(eventData.titre)
        }
      }

      setLoading(false)
    }

    fetchVideo()
  }, [params.id])

  if (loading) return <p>Chargement...</p>
  if (error) return <p style={{ color: 'red' }}>{error}</p>
  if (!video) return <p>Pas de vidéo disponible.</p>

  return (
    <div style={{ maxWidth: 600, margin: '40px auto', padding: 20 }}>
      {/* Titre de la vidéo au-dessus */}
      <h1>{video.titre}</h1>

      {/* La vidéo */}
      {video.url_importee ? (
        <video
          controls
          width="100%"
          src={video.url_importee}
          style={{ marginTop: 10, marginBottom: 20, borderRadius: 8 }}
        >
          Votre navigateur ne supporte pas la lecture de vidéo.
        </video>
      ) : (
        <p>Pas de vidéo disponible.</p>
      )}

      {/* Les autres infos en dessous */}
      <div>
        <p><strong></strong> {video.description}</p>
        <p><strong>Événement :</strong> {eventTitle || 'Non spécifié'}</p>
        <p><strong>Date d'ajout :</strong> {new Date(video.uploaded_at).toLocaleString()}</p>
      </div>
    </div>
  )
}
