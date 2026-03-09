# API Reference

Complete API documentation for the xmarte home automation system.

## Base URL

```
http://localhost:4000/api
```

In production, replace with your deployed URL.

---

## Camera API

### Initialize Camera Stream

Creates and initializes an RTSP stream connection for a Tapo camera.

**Endpoint:** `POST /api/camera/stream`

**Request Body:**
```json
{
  "cameraIp": "192.168.1.100",
  "username": "tapoadmin",
  "password": "your_password",
  "stream": "stream1"
}
```

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| cameraIp | string | Yes | IP address of the Tapo camera |
| username | string | Yes | Device account username |
| password | string | Yes | Device account password |
| stream | string | No | Stream quality: `stream1` (HD) or `stream2` (SD). Default: `stream1` |

**Response (200 OK):**
```json
{
  "rtspUrl": "rtsp://tapoadmin:password@192.168.1.100:554/stream1",
  "streamType": "stream1",
  "message": "RTSP URL generated successfully"
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "Missing required fields: cameraIp, username, password"
}
```

**Error Response (500 Internal Server Error):**
```json
{
  "error": "Failed to process camera stream request"
}
```

**Example (cURL):**
```bash
curl -X POST http://localhost:4000/api/camera/stream \
  -H "Content-Type: application/json" \
  -d '{
    "cameraIp": "192.168.1.100",
    "username": "tapoadmin",
    "password": "mypassword",
    "stream": "stream1"
  }'
```

**Example (JavaScript):**
```javascript
const response = await fetch('/api/camera/stream', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    cameraIp: '192.168.1.100',
    username: 'tapoadmin',
    password: 'mypassword',
    stream: 'stream1',
  }),
});

const data = await response.json();
console.log(data.rtspUrl);
```

---

## Devices API

### List All Devices

Retrieves a list of all registered smart home devices.

**Endpoint:** `GET /api/devices`

**Query Parameters:** None

**Response (200 OK):**
```json
{
  "devices": [
    {
      "id": "1",
      "name": "Living Room Light",
      "type": "light",
      "status": "online",
      "location": "Living Room",
      "createdAt": "2026-03-01T10:00:00Z"
    }
  ]
}
```

**Example (cURL):**
```bash
curl http://localhost:4000/api/devices
```

---

### Get Device Details

Retrieves detailed information about a specific device.

**Endpoint:** `GET /api/devices/[id]`

**URL Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string | Yes | Device ID |

**Response (200 OK):**
```json
{
  "id": "1",
  "name": "Living Room Light",
  "type": "light",
  "status": "online",
  "location": "Living Room",
  "properties": {
    "brightness": 80,
    "color": "#FFFFFF"
  },
  "createdAt": "2026-03-01T10:00:00Z",
  "updatedAt": "2026-03-08T15:30:00Z"
}
```

**Error Response (404 Not Found):**
```json
{
  "error": "Device not found"
}
```

**Example (cURL):**
```bash
curl http://localhost:4000/api/devices/1
```

---

### Create Device

Registers a new smart home device.

**Endpoint:** `POST /api/devices`

**Request Body:**
```json
{
  "name": "Kitchen Light",
  "type": "light",
  "location": "Kitchen",
  "properties": {
    "brightness": 100,
    "color": "#FFFFFF"
  }
}
```

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| name | string | Yes | Device name |
| type | string | Yes | Device type (light, camera, sensor, etc.) |
| location | string | No | Physical location |
| properties | object | No | Device-specific properties |

**Response (201 Created):**
```json
{
  "id": "2",
  "name": "Kitchen Light",
  "type": "light",
  "status": "online",
  "location": "Kitchen",
  "properties": {
    "brightness": 100,
    "color": "#FFFFFF"
  },
  "createdAt": "2026-03-08T16:00:00Z"
}
```

**Example (cURL):**
```bash
curl -X POST http://localhost:4000/api/devices \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Kitchen Light",
    "type": "light",
    "location": "Kitchen"
  }'
```

---

### Update Device

Updates an existing device's information.

**Endpoint:** `PUT /api/devices/[id]`

**URL Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string | Yes | Device ID |

**Request Body:**
```json
{
  "name": "Living Room Light",
  "status": "offline",
  "properties": {
    "brightness": 50
  }
}
```

**Response (200 OK):**
```json
{
  "id": "1",
  "name": "Living Room Light",
  "type": "light",
  "status": "offline",
  "properties": {
    "brightness": 50,
    "color": "#FFFFFF"
  },
  "updatedAt": "2026-03-08T16:15:00Z"
}
```

**Example (cURL):**
```bash
curl -X PUT http://localhost:4000/api/devices/1 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "offline"
  }'
```

---

### Delete Device

Removes a device from the system.

**Endpoint:** `DELETE /api/devices/[id]`

**URL Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string | Yes | Device ID |

**Response (200 OK):**
```json
{
  "message": "Device deleted successfully",
  "id": "1"
}
```

**Error Response (404 Not Found):**
```json
{
  "error": "Device not found"
}
```

**Example (cURL):**
```bash
curl -X DELETE http://localhost:4000/api/devices/1
```

---

## Testing API

### Test Supabase Connection

Tests the connection to the Supabase database.

**Endpoint:** `GET /api/test-supabase`

**Response (200 OK):**
```json
{
  "status": "ok",
  "message": "Supabase connection successful",
  "timestamp": "2026-03-08T16:30:00Z"
}
```

**Error Response (500 Internal Server Error):**
```json
{
  "status": "error",
  "message": "Failed to connect to Supabase",
  "error": "Connection timeout"
}
```

**Example (cURL):**
```bash
curl http://localhost:4000/api/test-supabase
```

---

## Error Handling

All API endpoints follow consistent error response formats.

### Standard Error Response

```json
{
  "error": "Error message description",
  "code": "ERROR_CODE",
  "details": {}
}
```

### HTTP Status Codes

| Status Code | Description |
|-------------|-------------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid request parameters |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 500 | Internal Server Error - Server error |
| 503 | Service Unavailable - Service temporarily unavailable |

---

## Authentication

**Status:** Not implemented yet

**Planned:** JWT-based authentication with Supabase Auth

**Future Headers:**
```
Authorization: Bearer <token>
```

---

## Rate Limiting

**Status:** Not implemented yet

**Planned Limits:**
- 100 requests per minute per IP
- 1000 requests per hour per user

---

## Webhooks

**Status:** Not implemented yet

**Planned Events:**
- `device.created`
- `device.updated`
- `device.status_changed`
- `camera.motion_detected`

---

## WebSocket Events

### Camera Stream Events

When connected to the RTSP WebSocket server:

**Connection URL:**
```
ws://localhost:9999/[cameraId]
```

**Events:**
- `stream.ready` - Stream initialized
- `stream.data` - Video frame data
- `stream.error` - Stream error
- `stream.ended` - Stream closed

---

## Type Definitions

### TypeScript Interfaces

```typescript
// Camera Stream Request
interface CameraStreamRequest {
  cameraIp: string;
  username: string;
  password: string;
  stream?: 'stream1' | 'stream2';
}

// Camera Stream Response
interface StreamResponse {
  rtspUrl: string;
  streamType: string;
  message: string;
}

// Tapo Camera Config
interface TapoCameraConfig {
  id: string;
  name: string;
  ip: string;
  username: string;
  password: string;
  stream?: 'stream1' | 'stream2';
}

// Device
interface Device {
  id: string;
  name: string;
  type: string;
  status: 'online' | 'offline';
  location?: string;
  properties?: Record<string, any>;
  createdAt: string;
  updatedAt?: string;
}
```

---

## Best Practices

### Request Headers

Always include:
```
Content-Type: application/json
```

### Error Handling

Always handle errors gracefully:
```javascript
try {
  const response = await fetch('/api/devices');
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
} catch (error) {
  console.error('API Error:', error);
}
```

### Timeouts

Set reasonable timeouts for requests:
```javascript
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 5000);

try {
  const response = await fetch('/api/devices', {
    signal: controller.signal
  });
} finally {
  clearTimeout(timeoutId);
}
```

---

## Examples

### Complete Camera Stream Setup

```javascript
// 1. Initialize stream
const initStream = async () => {
  const response = await fetch('/api/camera/stream', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      cameraIp: '192.168.1.100',
      username: 'tapoadmin',
      password: 'mypassword',
      stream: 'stream1',
    }),
  });

  const { rtspUrl } = await response.json();

  // 2. Connect to WebSocket
  const wsUrl = 'ws://localhost:9999/camera1';
  const player = new JSMpeg.Player(wsUrl, {
    canvas: canvasElement,
    autoplay: true,
  });
};
```

---

## Changelog

### v1.0.0 (2026-03-08)
- Initial API release
- Camera streaming endpoint
- Device management endpoints
- Supabase test endpoint

---

For questions or issues, please refer to the main documentation in `/docs`.
