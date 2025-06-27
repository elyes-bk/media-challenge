'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '../../../lib/supabaseClient'


export default function VideoPage() {
  const params = useParams()
  const [video, setVideo] = useState(null)
  const [eventTitle, setEventTitle] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const videoRef = useRef(null)

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

  const handleFullscreen = () => {
    const videoElement = videoRef.current
    if (videoElement?.requestFullscreen) {
      videoElement.requestFullscreen()
    } else if (videoElement?.webkitRequestFullscreen) {
      videoElement.webkitRequestFullscreen()
    } else if (videoElement?.msRequestFullscreen) {
      videoElement.msRequestFullscreen()
    }
  }

  if (loading) return <p>Chargement...</p>
  if (error) return <p style={{ color: 'red' }}>{error}</p>
  if (!video) return <p>Pas de vidéo disponible.</p>

  return (
    <div style={{
      backgroundColor: '#000',
      color: '#fff',
      padding: '24px 16px',
    }}>
      {/* Vidéo + bouton */}
      <div style={{ width: '100%', position: 'relative', marginTop: '60px' }}>
        <video
          ref={videoRef}
          src={video.url_importee}
          controls
          style={{
            width: '100%',
            height: '320px',
            objectFit: 'cover',
            borderRadius: '12px'
          }}
        >
          Votre navigateur ne supporte pas la lecture de vidéo.
        </video>

      </div>

      {/* Titre + Description sous la vidéo */}
      <div style={{
        marginTop: '80px', // espace après la vidéo
        // backgroundColor: '#111',
        borderRadius: '16px',
        padding: '16px'
      }}>
        <h3 style={{ margin: 0 }}>{video.titre}</h3>
        <p style={{ fontSize: '14px', marginTop: '16px' }}>
          {video.description}
        </p>
      </div>
    </div>
  )
}
