# Heyama Objects

A full-stack application to manage a collection of "Objects" with image upload.

## Architecture

| Component | Technology | Port |
|-----------|------------|------|
| REST API | NestJS + MongoDB + Socket.IO | 3001 |
| Web App | Next.js + shadcn/ui | 3000 |
| Mobile App | React Native + Expo | Expo DevTools |
| Database | MongoDB | 27017 |
| S3 Storage | MinIO (S3-compatible) | 9000 (API) / 9001 (Console) |

## Prerequisites

- **Node.js** >= 18
- **Docker & Docker Compose** (for MongoDB + MinIO)
- **Expo CLI** (`npm install -g expo-cli`) for mobile

## Quick Start

### 1. Start Infrastructure

```bash
docker-compose up -d
```

This starts MongoDB and MinIO. MinIO console is accessible at http://localhost:9001 (user: `minioadmin`, password: `minioadmin`).

### 2. Start the API

```bash
cd api
npm install
npm run start:dev
```

API runs at http://localhost:3001

### 3. Start the Web App

```bash
cd web
npm install
npm run dev
```

Web app runs at http://localhost:3000

### 4. Start the Mobile App

```bash
cd mobile
npm install
npx expo start
```

Scan the QR code with Expo Go or press `a` for Android emulator.

## Features

- **CRUD Operations**: Create, Read, Delete objects with images
- **Image Upload**: Images stored in MinIO (S3-compatible)
- **Real-time Sync**: Socket.IO enables real-time updates across all clients
- **Responsive Web UI**: Built with shadcn/ui components
- **Native Mobile UI**: Built with React Native + Expo

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /objects | Create object with image upload |
| GET | /objects | List all objects |
| GET | /objects/:id | Get single object |
| DELETE | /objects/:id | Delete object + S3 image |

## Real-time Events (Socket.IO)

| Event | Payload | Description |
|-------|---------|-------------|
| `object:created` | Object | Emitted when a new object is created |
| `object:deleted` | string (id) | Emitted when an object is deleted |

## Project Structure

```
├── api/                  # NestJS REST API
│   └── src/
│       ├── objects/      # Objects module (CRUD + WebSocket)
│       └── s3/           # MinIO/S3 service
├── web/                  # Next.js Web App
│   └── src/
│       ├── app/          # Pages (list, create, detail)
│       ├── components/   # shadcn/ui components
│       └── lib/          # API client + Socket.IO
├── mobile/               # React Native + Expo
│   ├── app/              # Screens (list, create, detail)
│   └── lib/              # API client + Socket.IO
└── docker-compose.yml    # MongoDB + MinIO
```
