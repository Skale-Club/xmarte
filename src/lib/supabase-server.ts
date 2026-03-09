import { createClient } from '@supabase/supabase-js'

function getSupabaseServerConfig() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceRoleKey) {
        throw new Error('Missing Supabase environment variables for server-side client.')
    }

    return { supabaseUrl, supabaseServiceRoleKey }
}

/**
 * Server-side Supabase client with service role key.
 * Use this ONLY in API routes or server-side code.
 * This client bypasses Row Level Security (RLS).
 */
export function getSupabaseServerClient() {
    const { supabaseUrl, supabaseServiceRoleKey } = getSupabaseServerConfig()

    return createClient(supabaseUrl, supabaseServiceRoleKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    })
}
