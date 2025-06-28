'use client'
import { useEffect, useState, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet'
import L from 'leaflet'
import SwipePopUp from './SwipePopUp'

// Formule de Haversine pour calculer la distance entre deux points GPS en mètres
function getDistanceFromLatLonInM(lat1, lon1, lat2, lon2) {
  function deg2rad(deg) { return deg * (Math.PI/180) }
  const R = 6371000 // Rayon de la Terre en mètres
  const dLat = deg2rad(lat2-lat1)
  const dLon = deg2rad(lon2-lon1)
  const a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}

// Composant pour recentrer et ouvrir le popup
function MapFocus({ focusedEvent, markerRefs }) {
  const map = useMap()
  useEffect(() => {
    if (focusedEvent && focusedEvent.latitude && focusedEvent.longitude) {
      map.setView([focusedEvent.latitude, focusedEvent.longitude], 16, { animate: true })
      // Ouvre le popup du marker correspondant
      const ref = markerRefs.current[focusedEvent.id]
      if (ref && ref.openPopup) {
        ref.openPopup()
      }
    }
  }, [focusedEvent, map, markerRefs])
  return null
}


export default function InteractiveMap({ events, proximityRadius = 100, focusedEvent }) {
  const [userPosition, setUserPosition] = useState(null)
  const [notifiedEvents, setNotifiedEvents] = useState([])
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [icons, setIcons] = useState({ customIcon: null, myPositionIcon: null })


  // Pour gérer les refs des markers
  const markerRefs = useRef({})

  // Demande la position de l'utilisateur
  useEffect(() => {

    // Définir une icône personnalisée
    const customIcon = new L.Icon({
      iconUrl: '/icon/Frame.png', // Placez votre image dans le dossier public ou changez le chemin
      iconSize: [32, 32], // taille de l'icône
      iconAnchor: [16, 32], // point de l'icône correspondant à la position du marker
      popupAnchor: [0, -32], // point d'où le popup s'ouvre relativement à l'iconAnchor
    })

    const myPositionIcon = new L.Icon({
      iconUrl: '/icon/Frame.png', // Placez votre image dans le dossier public ou changez le chemin
      iconSize: [32, 32], // taille de l'icône
      iconAnchor: [16, 32], // point de l'icône correspondant à la position du marker
      popupAnchor: [0, -32], // point d'où le popup s'ouvre relativement à l'iconAnchor
    })
    setIcons({customIcon,myPositionIcon})
  },[])

  useEffect(()=>{
    if (!navigator.geolocation) return
    const watchId = navigator.geolocation.watchPosition(
      pos => {
        setUserPosition([pos.coords.latitude, pos.coords.longitude])
      },
      err => { /* Optionnel : gérer l'erreur */ },
      { enableHighAccuracy: true }
    )
    return () => navigator.geolocation.clearWatch(watchId)
  }, [])

  // Détection de proximité
  useEffect(() => {
    if (!userPosition || !events) return
    events.forEach(ev => {
      const dist = getDistanceFromLatLonInM(
        userPosition[0], userPosition[1],
        ev.latitude, ev.longitude
      )
      if (dist <= proximityRadius && !notifiedEvents.includes(ev.id)) {
        alert(`Vous êtes à moins de ${proximityRadius}m de "${ev.titre}" !`)
        setNotifiedEvents(arr => [...arr, ev.id])
      }
    })
  }, [userPosition, events, proximityRadius, notifiedEvents])

  if (!icons.customIcon || !icons.myPositionIcon) {
    return null // ou un loader si tu veux
  }

  return (
    <div className="relative">
      <MapContainer
        center={
          focusedEvent && focusedEvent.latitude && focusedEvent.longitude
            ? [focusedEvent.latitude, focusedEvent.longitude]
            : (userPosition || [48.8584, 2.2945])
        }
        zoom={13}
        style={{ height: 'calc(100vh - 72px)', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapFocus focusedEvent={focusedEvent} markerRefs={markerRefs} />
        {events.map(ev => (
          <Marker
            key={ev.id}
            position={[ev.latitude, ev.longitude]}
            ref={ref => { markerRefs.current[ev.id] = ref }}
            icon={icons.customIcon} // <-- Ajout de l'icône personnalisée ici
            eventHandlers={{
              click: () => setSelectedEvent(ev)
            }}
          >
          {/*
            <Popup>
              <strong>{ev.titre}</strong><br />
              {ev.description}
            </Popup>
          */}
          
            <Circle
              center={[ev.latitude, ev.longitude]}
              radius={proximityRadius}
              pathOptions={{ color: 'blue', fillColor: 'blue', fillOpacity: 0.1 }}
            />
          </Marker>
        ))}
        {userPosition && (
          <Marker position={userPosition} icon={icons.myPositionIcon}>
            <Popup>Votre position</Popup>
          </Marker>
        )}
      </MapContainer>
      <SwipePopUp 
        event={selectedEvent} 
        onClose={()=>setSelectedEvent(null)}
      />
      
    </div>
  )
}
