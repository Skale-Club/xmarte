import { createClient } from '@supabase/supabase-js'

function getSupabaseConfig() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error('Missing Supabase environment variables. Please check your .env.local file.')
    }

    return { supabaseUrl, supabaseAnonKey }
}

export function getSupabaseClient() {
    const { supabaseUrl, supabaseAnonKey } = getSupabaseConfig()
    return createClient(supabaseUrl, supabaseAnonKey)
}

// Types for your database tables can be added here
// Example: export type Database = typeof import('./database.types')
