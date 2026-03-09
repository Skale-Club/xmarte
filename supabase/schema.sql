-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Rooms table
CREATE TABLE IF NOT EXISTS rooms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    icon VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Devices table
CREATE TABLE IF NOT EXISTS devices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('light', 'switch', 'sensor', 'thermostat', 'camera', 'lock', 'blind', 'fan', 'media_player')),
    room_id UUID REFERENCES rooms(id) ON DELETE SET NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'offline' CHECK (status IN ('online', 'offline', 'unavailable')),
    icon VARCHAR(100),
    last_seen TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Device states table (stores the current state of each device)
CREATE TABLE IF NOT EXISTS device_states (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    device_id UUID REFERENCES devices(id) ON DELETE CASCADE UNIQUE,
    
    -- For lights
    on_state BOOLEAN DEFAULT false,
    brightness INTEGER CHECK (brightness >= 0 AND brightness <= 100),
    color VARCHAR(20),
    color_temp INTEGER,
    
    -- For thermostats
    temperature DECIMAL(5,2),
    target_temperature DECIMAL(5,2),
    mode VARCHAR(20) CHECK (mode IN ('heat', 'cool', 'auto', 'off')),
    humidity DECIMAL(5,2),
    
    -- For sensors
    value DECIMAL(10,2),
    unit VARCHAR(20),
    
    -- For locks
    locked BOOLEAN DEFAULT false,
    
    -- For blinds
    position INTEGER CHECK (position >= 0 AND position <= 100),
    
    -- For fans
    speed INTEGER CHECK (speed >= 0 AND speed <= 100),
    
    -- For media players
    playing BOOLEAN DEFAULT false,
    volume INTEGER CHECK (volume >= 0 AND volume <= 100),
    source VARCHAR(100),
    
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Automations table
CREATE TABLE IF NOT EXISTS automations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    enabled BOOLEAN DEFAULT true,
    
    -- Trigger configuration (stored as JSONB for flexibility)
    trigger JSONB NOT NULL,
    
    -- Conditions (stored as JSONB array)
    conditions JSONB,
    
    -- Actions (stored as JSONB array)
    actions JSONB NOT NULL,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Automation execution history (optional, for logging)
CREATE TABLE IF NOT EXISTS automation_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    automation_id UUID REFERENCES automations(id) ON DELETE CASCADE,
    executed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    success BOOLEAN DEFAULT true,
    error_message TEXT
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_devices_room_id ON devices(room_id);
CREATE INDEX IF NOT EXISTS idx_devices_type ON devices(type);
CREATE INDEX IF NOT EXISTS idx_devices_status ON devices(status);
CREATE INDEX IF NOT EXISTS idx_device_states_device_id ON device_states(device_id);
CREATE INDEX IF NOT EXISTS idx_automations_enabled ON automations(enabled);
CREATE INDEX IF NOT EXISTS idx_automation_history_automation_id ON automation_history(automation_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_rooms_updated_at BEFORE UPDATE ON rooms
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_devices_updated_at BEFORE UPDATE ON devices
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_device_states_updated_at BEFORE UPDATE ON device_states
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_automations_updated_at BEFORE UPDATE ON automations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE device_states ENABLE ROW LEVEL SECURITY;
ALTER TABLE automations ENABLE ROW LEVEL SECURITY;
ALTER TABLE automation_history ENABLE ROW LEVEL SECURITY;

-- For now, allow all operations for authenticated users
-- You can customize these policies based on your authentication needs
CREATE POLICY "Allow all for authenticated users" ON rooms FOR ALL USING (true);
CREATE POLICY "Allow all for authenticated users" ON devices FOR ALL USING (true);
CREATE POLICY "Allow all for authenticated users" ON device_states FOR ALL USING (true);
CREATE POLICY "Allow all for authenticated users" ON automations FOR ALL USING (true);
CREATE POLICY "Allow all for authenticated users" ON automation_history FOR ALL USING (true);

-- Allow anonymous access for development (remove in production or add proper auth)
CREATE POLICY "Allow anonymous read" ON rooms FOR SELECT USING (true);
CREATE POLICY "Allow anonymous read" ON devices FOR SELECT USING (true);
CREATE POLICY "Allow anonymous read" ON device_states FOR SELECT USING (true);
CREATE POLICY "Allow anonymous read" ON automations FOR SELECT USING (true);

-- Cameras table (for Tapo camera integration)
CREATE TABLE IF NOT EXISTS cameras (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    ip VARCHAR(45) NOT NULL, -- Supports both IPv4 and IPv6
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL, -- Consider encrypting this in production
    stream VARCHAR(10) NOT NULL DEFAULT 'stream1' CHECK (stream IN ('stream1', 'stream2')),
    port INTEGER DEFAULT 554,
    enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Camera recordings table (for future use)
CREATE TABLE IF NOT EXISTS camera_recordings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    camera_id UUID REFERENCES cameras(id) ON DELETE CASCADE,
    file_path VARCHAR(500) NOT NULL,
    file_size BIGINT,
    duration INTEGER, -- Duration in seconds
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for cameras
CREATE INDEX IF NOT EXISTS idx_cameras_enabled ON cameras(enabled);
CREATE INDEX IF NOT EXISTS idx_camera_recordings_camera_id ON camera_recordings(camera_id);
CREATE INDEX IF NOT EXISTS idx_camera_recordings_start_time ON camera_recordings(start_time);

-- Trigger for cameras updated_at
CREATE TRIGGER update_cameras_updated_at BEFORE UPDATE ON cameras
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS policies for cameras
ALTER TABLE cameras ENABLE ROW LEVEL SECURITY;
ALTER TABLE camera_recordings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all for authenticated users" ON cameras FOR ALL USING (true);
CREATE POLICY "Allow all for authenticated users" ON camera_recordings FOR ALL USING (true);

-- Allow anonymous access for development
CREATE POLICY "Allow anonymous operations" ON cameras FOR ALL USING (true);
CREATE POLICY "Allow anonymous read" ON camera_recordings FOR SELECT USING (true);
