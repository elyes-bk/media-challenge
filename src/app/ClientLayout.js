'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function ClientLayout({ children }) {
  const [theme, setTheme] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTheme = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        const { data, error } = await supabase
          .from('users')
          .select('theme')
          .eq('id', session.user.id)
          .single()
        if (!error && data) {
          setTheme(data.theme)
          if (data.theme) {
            document.documentElement.classList.add('dark')
          } else {
            document.documentElement.classList.remove('dark')
          }
        }
      } else {
        const storedTheme = localStorage.getItem('theme')
        const isDark = storedTheme === 'true'
        setTheme(isDark)
        if (isDark) {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }
      }
      setLoading(false)
    }
    fetchTheme()
  }, [])

  const toggleTheme = async () => {
    const newTheme = !theme
    setTheme(newTheme)
    if (newTheme) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    const { data: { session } } = await supabase.auth.getSession()
    if (session) {
      await supabase
        .from('users')
        .update({ theme: newTheme })
        .eq('id', session.user.id)
    } else {
      localStorage.setItem('theme', newTheme)
    }
  }

  if (loading) return null

  return (
    <>
      <button
        onClick={toggleTheme}
        className="fixed top-4 right-4 z-50 bg-white dark:bg-[#23221f] border rounded-full p-2 shadow hover:bg-gray-100 dark:hover:bg-[#444] transition"
        aria-label="Changer le thème"
      >
        {theme ? '☀️' : '🌙'}
      </button>
      {children}
    </>
  )
}
