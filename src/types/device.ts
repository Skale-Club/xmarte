// Device types for the home automation system

export type DeviceType =
    | 'light'
    | 'switch'
    | 'sensor'
    | 'thermostat'
    | 'camera'
    | 'lock'
    | 'blind'
    | 'fan'
    | 'media_player';

export type DeviceStatus = 'online' | 'offline' | 'unavailable';

export interface Device {
    id: string;
    name: string;
    type: DeviceType;
    room: string;
    status: DeviceStatus;
    state: DeviceState;
    icon?: string;
    lastSeen?: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface DeviceState {
    // For lights
    on?: boolean;
    brightness?: number; // 0-100
    color?: string; // hex color
    colorTemp?: number; // kelvin

    // For thermostats
    temperature?: number;
    targetTemperature?: number;
    mode?: 'heat' | 'cool' | 'auto' | 'off';
    humidity?: number;

    // For sensors
    value?: number;
    unit?: string;

    // For locks
    locked?: boolean;

    // For blinds
    position?: number; // 0-100

    // For fans
    speed?: number; // 0-100

    // For media players
    playing?: boolean;
    volume?: number;
    source?: string;
}

export interface Room {
    id: string;
    name: string;
    icon?: string;
    devices: Device[];
}

export interface AutomationRule {
    id: string;
    name: string;
    description?: string;
    enabled: boolean;
    trigger: AutomationTrigger;
    conditions?: AutomationCondition[];
    actions: AutomationAction[];
    createdAt: Date;
    updatedAt: Date;
}

export interface AutomationTrigger {
    type: 'time' | 'device_state' | 'sensor_value' | 'manual';
    deviceId?: string;
    property?: string;
    operator?: 'eq' | 'ne' | 'gt' | 'lt' | 'gte' | 'lte';
    value?: any;
    time?: string; // cron expression or specific time
}

export interface AutomationCondition {
    type: 'device_state' | 'time_range' | 'day_of_week';
    deviceId?: string;
    property?: string;
    operator?: string;
    value?: any;
}

export interface AutomationAction {
    type: 'set_state' | 'toggle' | 'notify' | 'delay';
    deviceId?: string;
    property?: string;
    value?: any;
    message?: string;
    duration?: number; // for delay in seconds
}

export interface DashboardConfig {
    rooms: Room[];
    favoriteDevices: string[];
    automations: AutomationRule[];
}
