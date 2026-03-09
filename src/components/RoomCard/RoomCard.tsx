'use client';

import React from 'react';
import {
    Sofa,
    Bed,
    ChefHat,
    Bath,
    DoorOpen,
    Car,
    MoreHorizontal
} from 'lucide-react';
import { Room, Device } from '@/types/device';
import DeviceCard from '../DeviceCard/DeviceCard';
import styles from './RoomCard.module.css';

interface RoomCardProps {
    room: Room;
    devices: Device[];
    onDeviceClick?: (device: Device) => void;
}

const roomIcons: Record<string, React.ReactNode> = {
    'sofa': <Sofa size={20} />,
    'bed': <Bed size={20} />,
    'chef-hat': <ChefHat size={20} />,
    'bath': <Bath size={20} />,
    'door-open': <DoorOpen size={20} />,
    'car': <Car size={20} />,
};

export default function RoomCard({ room, devices, onDeviceClick }: RoomCardProps) {
    const onlineDevices = devices.filter(d => d.status === 'online').length;
    const activeDevices = devices.filter(d => {
        if (d.state.on !== undefined) return d.state.on;
        if (d.state.locked !== undefined) return d.state.locked;
        return false;
    }).length;

    return (
        <div className={styles.room}>
            <div className={styles.header}>
                <div className={styles.title}>
                    <span className={styles.icon}>
                        {roomIcons[room.icon || 'sofa'] || <MoreHorizontal size={20} />}
                    </span>
                    <h2 className={styles.name}>{room.name}</h2>
                </div>
                <div className={styles.stats}>
                    <span className={styles.stat}>
                        {onlineDevices}/{devices.length} online
                    </span>
                    <span className={styles.stat}>
                        {activeDevices} active
                    </span>
                </div>
            </div>

            <div className={styles.devices}>
                {devices.length === 0 ? (
                    <p className={styles.empty}>No devices in this room</p>
                ) : (
                    devices.map((device) => (
                        <DeviceCard
                            key={device.id}
                            device={device}
                            onClick={() => onDeviceClick?.(device)}
                        />
                    ))
                )}
            </div>
        </div>
    );
}
