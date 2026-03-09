'use client';

import { useEffect, useRef, useState } from 'react';
import { TapoCameraConfig, getRTSPUrl } from '@/lib/tapo-stream';

interface TapoCameraStreamProps {
  camera: TapoCameraConfig;
  width?: number;
  height?: number;
  autoplay?: boolean;
}

const RELAY_SERVER = 'http://localhost:9997';

type StreamStatus = 'idle' | 'registering' | 'connecting' | 'playing' | 'error' | 'stalled';

export default function TapoCameraStream({
  camera,
  width = 640,
  height = 360,
  autoplay = true,
}: TapoCameraStreamProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const playerRef = useRef<any>(null);
  const [status, setStatus] = useState<StreamStatus>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const startStream = async () => {
    setStatus('registering');
    setErrorMsg(null);

    // 1. Register camera with relay server → get WS port
    let wsPort: number;
    try {
      const res = await fetch(`${RELAY_SERVER}/camera`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: camera.id,
          name: camera.name,
          rtspUrl: getRTSPUrl(camera),
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(err.error || `Server responded with ${res.status}`);
      }

      ({ wsPort } = await res.json());
    } catch (e: any) {
      setStatus('error');
      setErrorMsg(
        e.message?.includes('fetch')
          ? 'Relay server not running. Start it with: node server/rtsp-websocket-server.js'
          : `Failed to start stream: ${e.message}`
      );
      return;
    }

    // 2. Connect JSMpeg to the WebSocket
    setStatus('connecting');
    try {
      const JSMpeg = (await import('jsmpeg-player')).default;

      if (!canvasRef.current) return;

      // Destroy previous player if any
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }

      playerRef.current = new JSMpeg.Player(`ws://localhost:${wsPort}`, {
        canvas: canvasRef.current,
        autoplay,
        audio: false,
        videoBufferSize: 512 * 1024,
        onPlay: () => setStatus('playing'),
        onStalled: () => setStatus('stalled'),
      });
    } catch (e: any) {
      setStatus('error');
      setErrorMsg(`Player error: ${e.message}`);
    }
  };

  useEffect(() => {
    if (autoplay) startStream();

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [camera.id]);

  const statusColor: Record<StreamStatus, string> = {
    idle:        '#6b7280',
    registering: '#f59e0b',
    connecting:  '#3b82f6',
    playing:     '#22c55e',
    error:       '#ef4444',
    stalled:     '#f59e0b',
  };

  const statusLabel: Record<StreamStatus, string> = {
    idle:        'Idle',
    registering: 'Starting...',
    connecting:  'Connecting...',
    playing:     'Live',
    error:       'Error',
    stalled:     'Stalled',
  };

  return (
    <div style={{ fontFamily: 'inherit' }}>
      <div style={{ position: 'relative', background: '#000', borderRadius: 8, overflow: 'hidden' }}>
        <canvas ref={canvasRef} width={width} height={height} style={{ width: '100%', height: 'auto', display: 'block' }} />

        {/* Overlay for non-playing states */}
        {status !== 'playing' && (
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            background: 'rgba(0,0,0,0.75)',
            gap: 12, padding: 16,
          }}>
            {status === 'error' ? (
              <>
                <span style={{ color: '#ef4444', fontSize: 14, textAlign: 'center', maxWidth: 320 }}>{errorMsg}</span>
                <button
                  onClick={startStream}
                  style={{
                    padding: '8px 20px', borderRadius: 8, border: 'none',
                    background: '#3b82f6', color: '#fff', fontSize: 13,
                    cursor: 'pointer', fontWeight: 600,
                  }}
                >
                  Retry
                </button>
              </>
            ) : (
              <span style={{ color: '#fff', fontSize: 14 }}>{statusLabel[status]}</span>
            )}
          </div>
        )}
      </div>

      {/* Camera info bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
        <span style={{ fontSize: 14, fontWeight: 600 }}>{camera.name}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 12, color: statusColor[status] }}>{statusLabel[status]}</span>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: statusColor[status] }} />
        </div>
      </div>
    </div>
  );
}
