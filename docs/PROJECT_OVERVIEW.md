# xmarte Project Overview

## Project Description

xmarte is a personalized home automation system built with Next.js, designed to provide centralized control and monitoring of smart home devices, including camera streams, device management, and more.

## Core Features

### 1. Device Management
- Add, edit, and remove smart home devices
- Real-time device status monitoring
- Device grouping and organization

### 2. Camera Integration
- Live streaming from TP-Link Tapo cameras
- Multi-camera grid view
- Low-latency RTSP streaming
- Recording capabilities (planned)

### 3. Backend Integration
- Supabase for database and authentication
- RESTful API routes
- Real-time data synchronization

## Technology Stack

### Frontend
- **Framework:** Next.js 14.0.0
- **Language:** TypeScript 5.3.2
- **UI Library:** React 18.2.0
- **State Management:** Zustand 4.4.7
- **Icons:** Lucide React 0.294.0

### Backend
- **Database:** Supabase (PostgreSQL)
- **API:** Next.js API Routes
- **Authentication:** Supabase Auth (planned)

### Streaming
- **RTSP Library:** node-rtsp-stream 0.0.9
- **Video Player:** JSMpeg Player 3.0.3
- **HTTP Client:** Axios 1.6.2

### Development
- **Linting:** ESLint 8.54.0
- **Node Types:** @types/node 20.10.0
- **React Types:** @types/react 18.2.39

## Architecture

### Application Structure

```
xmarte/
├── src/
│   ├── app/
│   │   ├── api/              # API routes
│   │   │   ├── camera/       # Camera streaming endpoints
│   │   │   ├── devices/      # Device management endpoints
│   │   │   └── test-supabase/# Supabase testing
│   │   ├── cameras/          # Camera viewing page
│   │   └── page.tsx          # Home page
│   ├── components/
│   │   └── TapoCameraStream.tsx  # Camera stream component
│   └── lib/
│       └── tapo-stream.ts    # Camera utility functions
├── server/
│   └── rtsp-websocket-server.js  # RTSP relay server
├── supabase/
│   └── schema.sql            # Database schema
└── docs/                     # Documentation
```

### Data Flow

```
User Browser
    ↓
Next.js App (Port 4000)
    ↓
API Routes (/api/*)
    ↓
Supabase Database
```

```
Tapo Camera (RTSP)
    ↓
RTSP WebSocket Server (Port 9999)
    ↓
WebSocket Stream
    ↓
JSMpeg Player (Browser)
```

## Environment Configuration

### Required Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
DATABASE_URL

# Tapo Cameras
TAPO_CAMERA_1_NAME
TAPO_CAMERA_1_IP
TAPO_CAMERA_1_USERNAME
TAPO_CAMERA_1_PASSWORD
TAPO_CAMERA_1_RTSP
```

See `.env.local.example` for complete configuration template.

## Development Workflow

### Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   - Copy `.env.local.example` to `.env.local`
   - Update with your credentials

3. **Start development server:**
   ```bash
   npm run dev -- -p 4000
   ```

4. **Access application:**
   - Main app: http://localhost:4000
   - API docs: Check individual route files

### Camera Streaming Workflow

1. **Start RTSP server** (separate terminal):
   ```bash
   node server/rtsp-websocket-server.js
   ```

2. **Access camera page:**
   - http://localhost:4000/cameras

## API Endpoints

### Device Management
- `GET /api/devices` - List all devices
- `POST /api/devices` - Create new device
- `GET /api/devices/[id]` - Get device details
- `PUT /api/devices/[id]` - Update device
- `DELETE /api/devices/[id]` - Delete device

### Camera Streaming
- `POST /api/camera/stream` - Initialize camera stream

### Testing
- `GET /api/test-supabase` - Test Supabase connection

## Database Schema

See `supabase/schema.sql` for complete database structure.

### Main Tables
- `devices` - Smart home device records
- `users` (planned) - User authentication
- `camera_recordings` (planned) - Camera recording metadata

## Security Considerations

### Current Implementation
- Environment variables for sensitive data
- `.env.local` excluded from version control
- Service role key server-side only

### Planned Improvements
- [ ] User authentication
- [ ] Role-based access control
- [ ] API rate limiting
- [ ] HTTPS for production
- [ ] Encrypted camera credentials storage
- [ ] Audit logging

## Deployment

### Prerequisites
- Node.js 16+ runtime
- FFmpeg installed (for camera streaming)
- Supabase project configured
- Network access to Tapo cameras

### Production Checklist
- [ ] Set environment variables
- [ ] Configure database
- [ ] Set up HTTPS
- [ ] Configure firewall rules
- [ ] Enable authentication
- [ ] Set up monitoring
- [ ] Configure backups

## Roadmap

### Phase 1 - Core Features ✅
- [x] Basic Next.js setup
- [x] Supabase integration
- [x] Device management API
- [x] Tapo camera streaming

### Phase 2 - Enhancement (In Progress)
- [ ] User authentication
- [ ] Dashboard UI
- [ ] Device control interface
- [ ] Camera recording

### Phase 3 - Advanced Features (Planned)
- [ ] Automation rules
- [ ] Notifications
- [ ] Mobile app
- [ ] Voice control integration
- [ ] Energy monitoring

## Known Issues

1. **Camera streaming requires separate server**
   - RTSP WebSocket server must run separately
   - Considering integration into Next.js custom server

2. **Security vulnerabilities in dependencies**
   - Run `npm audit` to review
   - Update dependencies regularly

3. **No authentication**
   - Anyone with network access can view cameras
   - Priority for next release

## Contributing

When adding new features:
1. Update relevant documentation
2. Add TypeScript types
3. Include error handling
4. Update API documentation
5. Add tests (when testing framework is added)

## Performance Optimization

### Current Optimizations
- Dynamic imports for heavy libraries
- Canvas-based video rendering
- Configurable stream quality

### Future Optimizations
- [ ] Image optimization
- [ ] Code splitting
- [ ] Lazy loading
- [ ] CDN integration
- [ ] Service workers

## Monitoring & Logging

### Current Implementation
- Console logging
- Error boundaries (planned)

### Planned Improvements
- [ ] Structured logging
- [ ] Error tracking (Sentry)
- [ ] Performance monitoring
- [ ] Analytics

## Support & Resources

- **Documentation:** `/docs`
- **Supabase Docs:** https://supabase.com/docs
- **Next.js Docs:** https://nextjs.org/docs
- **Tapo RTSP Guide:** See `docs/TAPO_CAMERA_SETUP.md`

---

Last updated: 2026-03-08
Project version: 1.0.0
