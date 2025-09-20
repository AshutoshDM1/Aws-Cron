# AWS Cron Monitor - Setup Guide

This project consists of a backend API server for monitoring websites with cron jobs and a Next.js frontend dashboard to visualize the monitoring data.

## Project Structure

```
aws-cron/
├── src/                 # Backend (Express + TypeScript)
├── web/                 # Frontend (Next.js + TypeScript)
├── data/                # Data storage (JSON files)
└── package.json         # Root package.json
```

## Prerequisites

- Node.js (v18 or higher)
- npm or pnpm

## Quick Start

### 1. Install Dependencies

**Backend:**
```bash
npm install
```

**Frontend:**
```bash
cd web
npm install
```

### 2. Start Development Servers

**Option A: Start both servers with one command**
```bash
npm run dev:all
```

**Option B: Start servers separately**

Terminal 1 (Backend):
```bash
npm run dev
```

Terminal 2 (Frontend):
```bash
cd web
npm run dev
```

### 3. Access the Application

- **Frontend Dashboard:** http://localhost:3000
- **Backend API:** http://localhost:4000/api
- **API Health Check:** http://localhost:4000/api/health

## Configuration

### Backend Configuration

Edit `src/config.ts` to add/modify monitored websites:

```typescript
export const siteConfigs: PingConfig[] = [
  {
    url: 'https://your-website.com',
    schedule: '*/30 * * * * *', // Every 30 seconds
    timeout: 10000,             // 10 seconds
    retries: 3,
    retryDelay: 30000          // 30 seconds
  },
  // Add more sites...
];
```

### Frontend Configuration

The frontend automatically connects to `http://localhost:4000/api`. To change this, update the `API_BASE_URL` in `web/lib/api.ts`.

## Available API Endpoints

- `GET /api/health` - Health check
- `GET /api/monitors` - Get all monitors with status
- `GET /api/configs` - Get monitoring configurations
- `GET /api/stats` - Get overall statistics
- `GET /api/results` - Get ping results
- `POST /api/monitors` - Add new monitor
- `PUT /api/monitors/:url` - Update monitor
- `DELETE /api/monitors/:url` - Delete monitor
- `POST /api/monitors/:url/ping` - Manual ping

## Features

### Backend Features
- ✅ Automated website monitoring with cron jobs
- ✅ Configurable ping intervals and retry logic
- ✅ JSON file-based data storage
- ✅ RESTful API for monitor management
- ✅ Real-time status tracking

### Frontend Features
- ✅ Real-time dashboard with monitor status
- ✅ Add/Edit/Delete monitors via UI
- ✅ Search and filter monitors
- ✅ Manual refresh for individual monitors
- ✅ Uptime percentage calculations
- ✅ Auto-refresh every 30 seconds
- ✅ Error handling and loading states

## Data Storage

The backend stores data in JSON files:
- `data/results.json` - All ping results
- `data/stats.json` - Overall statistics

## Development

### Backend Development
```bash
npm run dev        # Start with ts-node
npm run build      # Compile TypeScript
npm run start      # Run compiled version
```

### Frontend Development
```bash
cd web
npm run dev        # Start Next.js dev server
npm run build      # Build for production
npm run start      # Start production server
```

## Production Deployment

1. Build both backend and frontend:
```bash
npm run build
cd web && npm run build
```

2. Set environment variables:
```bash
export PORT=4000
export NODE_ENV=production
```

3. Start the backend:
```bash
npm start
```

4. Deploy the frontend to your preferred platform (Vercel, Netlify, etc.)

## Troubleshooting

### Common Issues

1. **Port already in use**: Change the port in `src/server.ts` (backend) or Next.js will auto-assign a different port for frontend.

2. **CORS errors**: The backend includes CORS middleware, but if you deploy to different domains, update the CORS configuration in `src/server.ts`.

3. **API connection failed**: Ensure the backend is running and accessible at the configured API URL.

### Logs

Backend logs will show:
- Cron job execution
- Ping results
- API requests
- Error messages

Check the console output for debugging information.
