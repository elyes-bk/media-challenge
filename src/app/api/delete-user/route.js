import { createClient } from '@supabase/supabase-js'

export async function POST(req) {
  const { id } = await req.json()

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY // clé haute secu pour autorisé la suppression
  )

  const { error } = await supabase.auth.admin.deleteUser(id)

  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 })

  // Optionnel : suppression de la table users aussi
  await supabase.from('users').delete().eq('id', id)

  return new Response(JSON.stringify({ success: true }), { status: 200 })
}
