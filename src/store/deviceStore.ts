import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Device, AutomationRule, Room } from '@/types/device';

interface DeviceStore {
    devices: Device[];
    rooms: Room[];
    automations: AutomationRule[];
    favoriteDeviceIds: string[];

    // Device actions
    addDevice: (device: Device) => void;
    updateDevice: (id: string, updates: Partial<Device>) => void;
    removeDevice: (id: string) => void;
    setDeviceState: (id: string, state: Partial<Device['state']>) => void;

    // Room actions
    addRoom: (room: Room) => void;
    updateRoom: (id: string, updates: Partial<Room>) => void;
    removeRoom: (id: string) => void;

    // Automation actions
    addAutomation: (automation: AutomationRule) => void;
    updateAutomation: (id: string, updates: Partial<AutomationRule>) => void;
    removeAutomation: (id: string) => void;
    toggleAutomation: (id: string) => void;

    // Favorites
    toggleFavorite: (deviceId: string) => void;

    // Getters
    getDeviceById: (id: string) => Device | undefined;
    getDevicesByRoom: (roomId: string) => Device[];
    getDevicesByType: (type: Device['type']) => Device[];
}

// Sample initial devices for demonstration
const initialDevices: Device[] = [
    {
        id: '1',
        name: 'Living Room Light',
        type: 'light',
        room: 'living-room',
        status: 'online',
        state: { on: true, brightness: 80, color: '#FFD93D' },
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: '2',
        name: 'Bedroom Light',
        type: 'light',
        room: 'bedroom',
        status: 'online',
        state: { on: false, brightness: 50 },
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: '3',
        name: 'Kitchen Thermostat',
        type: 'thermostat',
        room: 'kitchen',
        status: 'online',
        state: { temperature: 22, targetTemperature: 24, mode: 'heat', humidity: 45 },
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: '4',
        name: 'Front Door Lock',
        type: 'lock',
        room: 'entrance',
        status: 'online',
        state: { locked: true },
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: '5',
        name: 'Living Room Temperature',
        type: 'sensor',
        room: 'living-room',
        status: 'online',
        state: { value: 23, unit: '°C' },
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: '6',
        name: 'Living Room Blinds',
        type: 'blind',
        room: 'living-room',
        status: 'online',
        state: { position: 50 },
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: '7',
        name: 'Bedroom Fan',
        type: 'fan',
        room: 'bedroom',
        status: 'online',
        state: { on: false, speed: 30 },
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: '8',
        name: 'Smart TV',
        type: 'media_player',
        room: 'living-room',
        status: 'online',
        state: { playing: false, volume: 40, source: 'Netflix' },
        createdAt: new Date(),
        updatedAt: new Date(),
    },
];

const initialRooms: Room[] = [
    { id: 'living-room', name: 'Living Room', icon: 'sofa', devices: [] },
    { id: 'bedroom', name: 'Bedroom', icon: 'bed', devices: [] },
    { id: 'kitchen', name: 'Kitchen', icon: 'chef-hat', devices: [] },
    { id: 'bathroom', name: 'Bathroom', icon: 'bath', devices: [] },
    { id: 'entrance', name: 'Entrance', icon: 'door-open', devices: [] },
    { id: 'garage', name: 'Garage', icon: 'car', devices: [] },
];

const initialAutomations: AutomationRule[] = [
    {
        id: '1',
        name: 'Morning Routine',
        description: 'Turn on lights and set temperature at 7 AM',
        enabled: true,
        trigger: { type: 'time', time: '0 7 * * *' },
        actions: [
            { type: 'set_state', deviceId: '1', property: 'on', value: true },
            { type: 'set_state', deviceId: '3', property: 'targetTemperature', value: 22 },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: '2',
        name: 'Night Mode',
        description: 'Turn off all lights and lock doors at 11 PM',
        enabled: true,
        trigger: { type: 'time', time: '0 23 * * *' },
        actions: [
            { type: 'set_state', deviceId: '1', property: 'on', value: false },
            { type: 'set_state', deviceId: '2', property: 'on', value: false },
            { type: 'set_state', deviceId: '4', property: 'locked', value: true },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
    },
];

export const useDeviceStore = create<DeviceStore>()(
    persist(
        (set, get) => ({
            devices: initialDevices,
            rooms: initialRooms,
            automations: initialAutomations,
            favoriteDeviceIds: ['1', '4'],

            addDevice: (device) =>
                set((state) => ({
                    devices: [...state.devices, device],
                })),

            updateDevice: (id, updates) =>
                set((state) => ({
                    devices: state.devices.map((device) =>
                        device.id === id ? { ...device, ...updates, updatedAt: new Date() } : device
                    ),
                })),

            removeDevice: (id) =>
                set((state) => ({
                    devices: state.devices.filter((device) => device.id !== id),
                    favoriteDeviceIds: state.favoriteDeviceIds.filter((fid) => fid !== id),
                })),

            setDeviceState: (id, stateUpdates) =>
                set((state) => ({
                    devices: state.devices.map((device) =>
                        device.id === id
                            ? { ...device, state: { ...device.state, ...stateUpdates }, updatedAt: new Date() }
                            : device
                    ),
                })),

            addRoom: (room) =>
                set((state) => ({
                    rooms: [...state.rooms, room],
                })),

            updateRoom: (id, updates) =>
                set((state) => ({
                    rooms: state.rooms.map((room) =>
                        room.id === id ? { ...room, ...updates } : room
                    ),
                })),

            removeRoom: (id) =>
                set((state) => ({
                    rooms: state.rooms.filter((room) => room.id !== id),
                })),

            addAutomation: (automation) =>
                set((state) => ({
                    automations: [...state.automations, automation],
                })),

            updateAutomation: (id, updates) =>
                set((state) => ({
                    automations: state.automations.map((automation) =>
                        automation.id === id ? { ...automation, ...updates, updatedAt: new Date() } : automation
                    ),
                })),

            removeAutomation: (id) =>
                set((state) => ({
                    automations: state.automations.filter((automation) => automation.id !== id),
                })),

            toggleAutomation: (id) =>
                set((state) => ({
                    automations: state.automations.map((automation) =>
                        automation.id === id ? { ...automation, enabled: !automation.enabled } : automation
                    ),
                })),

            toggleFavorite: (deviceId) =>
                set((state) => ({
                    favoriteDeviceIds: state.favoriteDeviceIds.includes(deviceId)
                        ? state.favoriteDeviceIds.filter((id) => id !== deviceId)
                        : [...state.favoriteDeviceIds, deviceId],
                })),

            getDeviceById: (id) => get().devices.find((device) => device.id === id),

            getDevicesByRoom: (roomId) =>
                get().devices.filter((device) => device.room === roomId),

            getDevicesByType: (type) =>
                get().devices.filter((device) => device.type === type),
        }),
        {
            name: 'home-automation-storage',
        }
    )
);
