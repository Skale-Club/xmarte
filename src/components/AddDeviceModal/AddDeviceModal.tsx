'use client';

import React, { useState } from 'react';
import {
    X,
    Plus,
    Lightbulb,
    ToggleLeft,
    Thermometer,
    Camera,
    Lock,
    Wind,
    Tv,
    Activity,
    SlidersHorizontal,
    AlertCircle,
} from 'lucide-react';
import { useDeviceStore } from '@/store/deviceStore';
import { DeviceType, DeviceState } from '@/types/device';
import styles from './AddDeviceModal.module.css';

interface AddDeviceModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const DEVICE_TYPES: { value: DeviceType; label: string; icon: React.ReactNode }[] = [
    { value: 'light',        label: 'Light',        icon: <Lightbulb size={20} /> },
    { value: 'switch',       label: 'Switch',       icon: <ToggleLeft size={20} /> },
    { value: 'thermostat',   label: 'Thermostat',   icon: <Thermometer size={20} /> },
    { value: 'camera',       label: 'Camera',       icon: <Camera size={20} /> },
    { value: 'lock',         label: 'Lock',         icon: <Lock size={20} /> },
    { value: 'blind',        label: 'Blind',        icon: <SlidersHorizontal size={20} /> },
    { value: 'fan',          label: 'Fan',          icon: <Wind size={20} /> },
    { value: 'media_player', label: 'Media',        icon: <Tv size={20} /> },
    { value: 'sensor',       label: 'Sensor',       icon: <Activity size={20} /> },
];

function getInitialState(type: DeviceType): DeviceState {
    switch (type) {
        case 'light':        return { on: false, brightness: 100 };
        case 'switch':       return { on: false };
        case 'thermostat':   return { temperature: 20, targetTemperature: 22, mode: 'auto' };
        case 'lock':         return { locked: true };
        case 'blind':        return { position: 100 };
        case 'fan':          return { on: false, speed: 50 };
        case 'media_player': return { playing: false, volume: 50 };
        case 'sensor':       return { value: 0, unit: '' };
        default:             return {};
    }
}

export default function AddDeviceModal({ isOpen, onClose }: AddDeviceModalProps) {
    const { rooms, addDevice } = useDeviceStore();
    const [name, setName] = useState('');
    const [type, setType] = useState<DeviceType>('light');
    const [roomId, setRoomId] = useState(rooms[0]?.id ?? '');
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!name.trim()) {
            setError('Device name is required.');
            return;
        }
        if (!roomId) {
            setError('Please select a room.');
            return;
        }

        addDevice({
            id: `device_${Date.now()}`,
            name: name.trim(),
            type,
            room: roomId,
            status: 'online',
            state: getInitialState(type),
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        setName('');
        setType('light');
        setRoomId(rooms[0]?.id ?? '');
        setError(null);
        onClose();
    };

    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) onClose();
    };

    return (
        <div className={styles.overlay} onClick={handleOverlayClick}>
            <div className={styles.modal}>
                {/* Header */}
                <div className={styles.header}>
                    <div className={styles.headerLeft}>
                        <div className={styles.iconWrap}>
                            <Plus size={22} />
                        </div>
                        <div>
                            <div className={styles.title}>Add Device</div>
                            <div className={styles.subtitle}>Connect a new smart device</div>
                        </div>
                    </div>
                    <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
                        <X size={16} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className={styles.form}>
                    {/* Device Name */}
                    <div className={styles.field}>
                        <label className={styles.label} htmlFor="device-name">Device Name</label>
                        <input
                            id="device-name"
                            className={styles.input}
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g., Bedroom Light"
                            autoFocus
                        />
                    </div>

                    {/* Device Type */}
                    <div className={styles.field}>
                        <span className={styles.label}>Device Type</span>
                        <div className={styles.typeGrid}>
                            {DEVICE_TYPES.map((dt) => (
                                <button
                                    key={dt.value}
                                    type="button"
                                    className={`${styles.typeBtn} ${type === dt.value ? styles.selected : ''}`}
                                    onClick={() => setType(dt.value)}
                                >
                                    {dt.icon}
                                    {dt.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Room */}
                    <div className={styles.field}>
                        <label className={styles.label} htmlFor="device-room">Room</label>
                        <select
                            id="device-room"
                            className={styles.select}
                            value={roomId}
                            onChange={(e) => setRoomId(e.target.value)}
                        >
                            {rooms.map((room) => (
                                <option key={room.id} value={room.id}>
                                    {room.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className={styles.error}>
                            <AlertCircle size={15} />
                            {error}
                        </div>
                    )}
                </form>

                {/* Footer */}
                <div className={styles.footer}>
                    <button type="button" className={styles.cancelBtn} onClick={onClose}>
                        Cancel
                    </button>
                    <button type="submit" className={styles.submitBtn} onClick={handleSubmit}>
                        <Plus size={16} />
                        Add Device
                    </button>
                </div>
            </div>
        </div>
    );
}
