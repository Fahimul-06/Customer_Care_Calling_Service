# Customer Care Calling Frontend

Standalone React + Vite frontend for the Customer Care Calling service.

It supports:

- Customer Care/Admin joining calls
- Delivery Man joining calls
- Direct WebRTC audio
- Own-server Socket.IO relay fallback
- Call room page: `/call/:roomId?role=admin` or `/call/:roomId?role=delivery`
- Token configuration screen
- Manual room join screen

## Run

```bash
npm install
npm run dev
```

Open:

```txt
http://localhost:5173
```

## Environment

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Set your backend URL:

```env
VITE_API_URL=http://localhost:5000
```

## Required backend

This frontend expects the backend routes/socket events from the previous `customer-care-calling-only.zip` package:

```txt
GET   /api/calls/:roomId
PATCH /api/calls/:roomId/status
Socket.IO events:
  call:join
  call:signal
  call:end
  call:relay-mode
  call:relay-ready
  call:relay-audio
```

## Token storage

The frontend reads JWT tokens from localStorage:

```txt
adminToken
 deliveryToken
```

You can paste them from the home page UI.

## Use in another app

Copy these folders into your React app:

```txt
src/features/customerCareCalling
src/lib/api.ts
src/lib/socket.ts
src/pages/CallRoomPage.tsx
```

Add route:

```tsx
<Route path="/call/:roomId" element={<CallRoomPage />} />
```
