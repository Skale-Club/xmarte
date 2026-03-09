import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

export const dynamic = 'force-dynamic';

// GET - List all cameras
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('cameras')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ cameras: data });
  } catch (error) {
    console.error('Error fetching cameras:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cameras' },
      { status: 500 }
    );
  }
}

// POST - Create a new camera
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, ip, username, password, stream = 'stream1' } = body;

    // Validate required fields
    if (!name || !ip || !username || !password) {
      return NextResponse.json(
        { error: 'Missing required fields: name, ip, username, password' },
        { status: 400 }
      );
    }

    // Validate IP format
    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (!ipRegex.test(ip)) {
      return NextResponse.json(
        { error: 'Invalid IP address format' },
        { status: 400 }
      );
    }

    // Validate stream type
    if (stream !== 'stream1' && stream !== 'stream2') {
      return NextResponse.json(
        { error: 'Stream must be either "stream1" or "stream2"' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('cameras')
      .insert([
        {
          name,
          ip,
          username,
          password,
          stream,
          enabled: true,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ camera: data }, { status: 201 });
  } catch (error) {
    console.error('Error creating camera:', error);
    return NextResponse.json(
      { error: 'Failed to create camera' },
      { status: 500 }
    );
  }
}
