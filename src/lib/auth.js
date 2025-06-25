import { supabase } from './supabaseClient'

export async function getSessionAndRedirect(router, redirectTo) {
  const { data: { session } } = await supabase.auth.getSession()

  if (session) {
    router.replace(redirectTo)
    return true
  }

  return false
}

export async function isConnected() {
  const { data: { session } } = await supabase.auth.getSession()

  if (session) {
    return true
  }
  return false
}