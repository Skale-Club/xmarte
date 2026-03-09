import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

interface CameraStreamRequest {
  cameraIp: string;
  username: string;
  password: string;
  stream?: 'stream1' | 'stream2'; // stream1 = high quality, stream2 = 360p
}

export async function POST(request: NextRequest) {
  try {
    const body: CameraStreamRequest = await request.json();
    const { cameraIp, username, password, stream = 'stream1' } = body;

    if (!cameraIp || !username || !password) {
      return NextResponse.json(
        { error: 'Missing required fields: cameraIp, username, password' },
        { status: 400 }
      );
    }

    // Construct RTSP URL for Tapo camera
    // Format: rtsp://[username]:[password]@[camera-ip]:554/stream1
    const rtspUrl = `rtsp://${encodeURIComponent(username)}:${encodeURIComponent(password)}@${cameraIp}:554/${stream}`;

    // Return the RTSP URL and WebSocket port for client-side streaming
    return NextResponse.json({
      rtspUrl,
      streamType: stream,
      message: 'RTSP URL generated successfully',
    });
  } catch (error) {
    console.error('Camera stream error:', error);
    return NextResponse.json(
      { error: 'Failed to process camera stream request' },
      { status: 500 }
    );
  }
}
