'use client'

import { useEffect, useState, useRef } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { MdFullscreen } from 'react-icons/md'

export default function AllVideosPage() {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isLandscape, setIsLandscape] = useState(false)
  const [playingVideos, setPlayingVideos] = useState({})
  const videoRefs = useRef({})

  useEffect(() => {
    async function fetchVideos() {
      const { data, error } = await supabase.from('videos').select('*')
      if (error) {
        console.error('Erreur Supabase:', error)
        setError('Erreur lors du chargement des vidéos : ' + error.message)
        setLoading(false)
        return
      }
      setVideos(data)
      setLoading(false)
    }

    fetchVideos()
  }, [])

  useEffect(() => {
    const updateOrientation = () => {
      setIsLandscape(window.innerWidth > window.innerHeight)
    }

    updateOrientation()
    window.addEventListener('resize', updateOrientation)
    window.addEventListener('orientationchange', updateOrientation)

    return () => {
      window.removeEventListener('resize', updateOrientation)
      window.removeEventListener('orientationchange', updateOrientation)
    }
  }, [])

  const handleFullscreen = (videoElement) => {
    if (videoElement?.requestFullscreen) {
      videoElement.requestFullscreen()
    } else if (videoElement?.webkitRequestFullscreen) {
      videoElement.webkitRequestFullscreen()
    } else if (videoElement?.msRequestFullscreen) {
      videoElement.msRequestFullscreen()
    }
  }

  const togglePlayPause = (videoId) => {
    const video = videoRefs.current[videoId]
    if (!video) return

    if (video.paused) {
      video.play()
      setPlayingVideos((prev) => ({ ...prev, [videoId]: true }))
    } else {
      video.pause()
      setPlayingVideos((prev) => ({ ...prev, [videoId]: false }))
    }
  }

  if (loading) return <p>Chargement des vidéos...</p>
  if (error) return <p style={{ color: 'red' }}>{error}</p>
  if (videos.length === 0) return <p>Aucune vidéo trouvée.</p>

  return (
    <div
      style={{
        backgroundColor: '#000',
        color: '#fff',
        height: '100vh',
        overflowY: 'scroll',
        scrollSnapType: 'y mandatory',
      }}
    >
      {videos.map((video, index) => (
        <div
          key={video.id}
          style={{
            scrollSnapAlign: 'start',
            height: '100vh',
            padding: '16px',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          <div
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '900px',
              margin: '0 auto',
            }}
          >
            <video
              ref={(el) => (videoRefs.current[video.id] = el)}
              id={`video-${index}`}
              src={video.url_importee}
              controls={false}
              style={{
                width: '100%',
                height: isLandscape ? '80vh' : '320px',
                objectFit: 'cover',
                borderRadius: '12px',
                cursor: 'pointer',
              }}
              onClick={() => togglePlayPause(video.id)}
              onPlay={() =>
                setPlayingVideos((prev) => ({ ...prev, [video.id]: true }))
              }
              onPause={() =>
                setPlayingVideos((prev) => ({ ...prev, [video.id]: false }))
              }
            />

            {isLandscape && !playingVideos[video.id] && (
              <div
                style={{
                  position: 'absolute',
                  bottom: '40px',
                  left: '20px',
                  right: '20px',
                  background: 'rgba(0,0,0,0.5)',
                  borderRadius: '12px',
                  padding: '12px',
                  color: '#fff',
                  zIndex: 15,
                }}
              >
                <h6 style={{ margin: 0, fontSize: '20px' }}>{video.titre}</h6>
                <p style={{ fontSize: '14px', marginTop: '8px' }}>
                  {video.description}
                </p>
              </div>
            )}
          </div>

          {!isLandscape && (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '8px' }}>
              <button
                onClick={() =>
                  handleFullscreen(document.getElementById(`video-${index}`))
                }
                style={{
                  padding: '6px 16px',
                  backgroundColor: '#F4EDDE',
                  color: '#1B1811',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '15px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                Plein écran
                <MdFullscreen size={22} />
              </button>
            </div>
          )}

          {!isLandscape && (
            <div
              style={{
                marginTop: '90px',
                borderRadius: '16px',
                padding: '16px',
                color: '#F4EDDE',
              }}
            >
              <h6 style={{ margin: 0, fontSize: '20px' }}>{video.titre}</h6>
              <p style={{ fontSize: '12px', marginTop: '16px' }}>
                {video.description}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
