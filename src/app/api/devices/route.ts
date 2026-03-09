import { NextRequest, NextResponse } from 'next/server';
import { devices as initialDevices } from '@/data/devices';

// In-memory store for devices (in production, use a database)
let devices = [...initialDevices];

// GET /api/devices - Get all devices
export async function GET() {
    return NextResponse.json({
        success: true,
        data: devices,
    });
}

// POST /api/devices - Add a new device
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const newDevice = {
            id: `device-${Date.now()}`,
            ...body,
            status: 'online',
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        devices.push(newDevice);

        return NextResponse.json({
            success: true,
            data: newDevice,
        }, { status: 201 });
    } catch (error) {
        return NextResponse.json({
            success: false,
            error: 'Failed to create device',
        }, { status: 400 });
    }
}
