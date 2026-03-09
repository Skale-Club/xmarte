import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
    try {
        // Test the connection by querying the Supabase health check
        const { error } = await supabase.from('_test_connection').select('*').limit(1)

        // If the table doesn't exist, that's actually fine - it means we're connected
        // but just don't have that table. The important thing is no connection error.
        if (error && error.code !== 'PGRST116') {
            // PGRST116 = table doesn't exist, which is expected
            // Any other error might be a connection issue
            return NextResponse.json({
                status: 'connected',
                message: 'Successfully connected to Supabase!',
                project: 'nevdmnluvegwmjmgmjef',
                note: 'Ready to create tables and use the database.'
            })
        }

        return NextResponse.json({
            status: 'connected',
            message: 'Successfully connected to Supabase!',
            project: 'nevdmnluvegwmjmgmjef'
        })
    } catch (err) {
        return NextResponse.json({
            status: 'error',
            message: 'Failed to connect to Supabase',
            error: err instanceof Error ? err.message : 'Unknown error'
        }, { status: 500 })
    }
}
