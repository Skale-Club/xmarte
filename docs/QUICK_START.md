# Quick Start Guide

Get up and running with xmarte in 5 minutes!

## Prerequisites

- ✅ Node.js 16+ installed
- ✅ Supabase account (free tier works!)
- ✅ TP-Link Tapo camera (optional)

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Configure Environment

1. Copy the environment template:
   ```bash
   cp .env.local.example .env.local
   ```

2. Update `.env.local` with your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

## Step 3: Setup Database

1. Go to your Supabase project dashboard
2. Click "SQL Editor" in the sidebar
3. Copy and paste the contents of `supabase/schema.sql`
4. Click "Run" to create all tables

## Step 4: Start the App

```bash
npm run dev -- -p 4000
```

Open http://localhost:4000 in your browser! 🎉

## Step 5: Add a Camera (Optional)

### A. Create Device Account in Tapo App

1. Open Tapo app → Select camera
2. Settings → Advanced Settings → Device Account
3. Create new account with username/password

### B. Find Camera IP

- **Tapo App**: Settings → Device Info → IP Address
- **Router**: Check DHCP client list

### C. Add Camera via UI

1. Go to http://localhost:4000/cameras
2. Click "Add Device"
3. Fill in:
   - Name: "Front Door"
   - IP: Your camera's IP
   - Username: Device account username
   - Password: Device account password
   - Stream: stream1 (HD) or stream2 (SD)
4. Click "Test Connection" (optional)
5. Click "Add Camera"

### D. Start RTSP Server

Open a new terminal:
```bash
node server/rtsp-websocket-server.js
```

### E. View Live Stream

Refresh http://localhost:4000/cameras - your camera should be streaming!

## Common Issues

### ❌ "Cannot connect to Supabase"

**Solution:** Check your `.env.local` file has correct credentials from Supabase dashboard.

### ❌ "Camera won't connect"

**Solution:**
- Verify camera IP with `ping [ip-address]`
- Ensure you're using Device Account (not cloud account)
- Check WiFi connection

### ❌ "Stream not showing"

**Solution:**
- Make sure RTSP server is running (`node server/rtsp-websocket-server.js`)
- Check firewall allows ports 554, 9999, 9998
- Try stream2 instead of stream1

## Next Steps

📚 **Read the Full Documentation**
- [Camera Management Guide](./CAMERA_MANAGEMENT.md)
- [API Reference](./API_REFERENCE.md)
- [Project Overview](./PROJECT_OVERVIEW.md)

🎨 **Explore Features**
- Device management at http://localhost:4000
- Camera streams at http://localhost:4000/cameras
- API testing with `/api/cameras`

🔧 **Customize**
- Add more cameras via UI
- Configure automation rules (coming soon)
- Integrate with other smart devices

## Helpful Commands

```bash
# Start dev server
npm run dev -- -p 4000

# Start RTSP server (separate terminal)
node server/rtsp-websocket-server.js

# Check Supabase connection
curl http://localhost:4000/api/test-supabase

# List all cameras
curl http://localhost:4000/api/cameras

# Add camera via API
curl -X POST http://localhost:4000/api/cameras \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Camera",
    "ip": "192.168.1.100",
    "username": "admin",
    "password": "password",
    "stream": "stream1"
  }'
```

## Need Help?

- 📖 Check [docs folder](./README.md) for detailed guides
- 🐛 Found a bug? Open an issue
- 💡 Have questions? See [troubleshooting sections](./CAMERA_MANAGEMENT.md#troubleshooting)

---

**That's it! You're all set up.** Happy automating! 🏠✨
