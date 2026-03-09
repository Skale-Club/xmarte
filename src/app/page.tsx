'use client';

import React, { useState } from 'react';
import { useDeviceStore } from '@/store/deviceStore';
import Sidebar from '@/components/Sidebar/Sidebar';
import RoomCard from '@/components/RoomCard/RoomCard';
import DeviceCard from '@/components/DeviceCard/DeviceCard';
import AutomationCard from '@/components/AutomationCard/AutomationCard';
import {
    Sun,
    Moon,
    Thermometer,
    Lock,
    Power,
    Activity
} from 'lucide-react';
import AddDeviceModal from '@/components/AddDeviceModal/AddDeviceModal';
import styles from './page.module.css';

export default function Dashboard() {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isAddDeviceOpen, setIsAddDeviceOpen] = useState(false);
    const {
        devices,
        rooms,
        automations,
        favoriteDeviceIds,
        getDevicesByRoom
    } = useDeviceStore();

    const favoriteDevices = devices.filter(d => favoriteDeviceIds.includes(d.id));
    const onlineDevices = devices.filter(d => d.status === 'online').length;
    const activeDevices = devices.filter(d => {
        if (d.state.on !== undefined) return d.state.on;
        if (d.state.locked !== undefined) return d.state.locked;
        return false;
    }).length;

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';
        return 'Good evening';
    };

    const renderDashboard = () => (
        <div className={styles.dashboard}>
            {/* Header Section */}
            <div className={styles.header}>
                <div className={styles.greeting}>
                    <h1>{getGreeting()}, Vanildo!</h1>
                    <p>Welcome to your smart home</p>
                </div>
                <div className={styles.quickStats}>
                    <div className={styles.statCard}>
                        <Activity size={20} />
                        <div>
                            <span className={styles.statValue}>{onlineDevices}</span>
                            <span className={styles.statLabel}>Online</span>
                        </div>
                    </div>
                    <div className={styles.statCard}>
                        <Power size={20} />
                        <div>
                            <span className={styles.statValue}>{activeDevices}</span>
                            <span className={styles.statLabel}>Active</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Favorites Section */}
            {favoriteDevices.length > 0 && (
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>
                        <Star size={20} /> Favorites
                    </h2>
                    <div className={styles.favoritesGrid}>
                        {favoriteDevices.map((device) => (
                            <DeviceCard key={device.id} device={device} />
                        ))}
                    </div>
                </section>
            )}

            {/* Rooms Section */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Rooms</h2>
                {rooms.map((room) => {
                    const roomDevices = getDevicesByRoom(room.id);
                    if (roomDevices.length === 0) return null;
                    return (
                        <RoomCard
                            key={room.id}
                            room={room}
                            devices={roomDevices}
                        />
                    );
                })}
            </section>
        </div>
    );

    const renderDevices = () => (
        <div className={styles.dashboard}>
            <h1 className={styles.pageTitle}>All Devices</h1>
            <div className={styles.devicesGrid}>
                {devices.map((device) => (
                    <DeviceCard key={device.id} device={device} />
                ))}
            </div>
        </div>
    );

    const renderAutomations = () => (
        <div className={styles.dashboard}>
            <h1 className={styles.pageTitle}>Automations</h1>
            <div className={styles.automationsGrid}>
                {automations.map((automation) => (
                    <AutomationCard key={automation.id} automation={automation} />
                ))}
            </div>
        </div>
    );

    const renderSettings = () => (
        <div className={styles.dashboard}>
            <h1 className={styles.pageTitle}>Settings</h1>
            <div className={styles.settingsCard}>
                <h3>System Information</h3>
                <div className={styles.settingsInfo}>
                    <div className={styles.infoRow}>
                        <span>Total Devices</span>
                        <span>{devices.length}</span>
                    </div>
                    <div className={styles.infoRow}>
                        <span>Total Rooms</span>
                        <span>{rooms.length}</span>
                    </div>
                    <div className={styles.infoRow}>
                        <span>Active Automations</span>
                        <span>{automations.filter(a => a.enabled).length}</span>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return renderDashboard();
            case 'devices':
                return renderDevices();
            case 'automations':
                return renderAutomations();
            case 'settings':
                return renderSettings();
            default:
                return renderDashboard();
        }
    };

    return (
        <div className={styles.container}>
            <Sidebar activeTab={activeTab} onTabChange={setActiveTab} onAddDevice={() => setIsAddDeviceOpen(true)} />
            <main className={styles.main}>
                {renderContent()}
            </main>
            <AddDeviceModal isOpen={isAddDeviceOpen} onClose={() => setIsAddDeviceOpen(false)} />
        </div>
    );
}

// Star component for favorites section
function Star({ size }: { size: number }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
    );
}
