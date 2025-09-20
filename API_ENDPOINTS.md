# Site Monitoring API

A simple Express + TypeScript backend that monitors websites using cron jobs and stores results in files.

## Getting Started

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Build and run in production
npm run build
npm start
```

The server will start on port 3000 (or PORT environment variable).

## API Endpoints

### Health Check
- **GET** `/api/health`
- Returns server status and timestamp

### Statistics
- **GET** `/api/stats`
- Returns overall ping statistics (total, success, failed, avg response time)

### Results
- **GET** `/api/results?limit=100`
- Returns recent ping results (default: last 100)
- Query params: `limit` (number of results to return)

### Results by URL
- **GET** `/api/results/:url?limit=50`
- Returns ping results for a specific URL (default: last 50)
- URL should be URL-encoded
- Query params: `limit` (number of results to return)

### Configurations
- **GET** `/api/configs`
- Returns all configured monitoring sites

### Monitors Management
- **GET** `/api/monitors`
- Returns monitors in frontend-compatible format with status, uptime, and history

- **POST** `/api/monitors`
- Add a new monitor
- Body: `{ "url": "string", "schedule": "string", "timeout": number, "retries": number, "retryDelay": number }`

- **PUT** `/api/monitors/:url`
- Update an existing monitor
- URL should be URL-encoded
- Body: Partial monitor configuration

- **DELETE** `/api/monitors/:url`
- Delete a monitor
- URL should be URL-encoded

- **POST** `/api/monitors/:url/ping`
- Trigger manual ping for a specific monitor
- URL should be URL-encoded

- **POST** `/api/reload`
- Reload monitors from JSON file

### URL Statistics (NEW)
- **GET** `/api/url-stats`
- Returns comprehensive URL statistics for all monitored sites
- Includes: URL, Uptime percentage, Check interval, Average response time, Current status, Last error

- **GET** `/api/url-stats/:url`
- Returns URL statistics for a specific URL
- URL should be URL-encoded

- **POST** `/api/url-stats/refresh`
- Manually refresh/update URL statistics
- Returns updated statistics for all URLs

## Data Storage

- Results are stored in `data/results.json`
- Stats are stored in `data/stats.json`
- Monitor configs are stored in `data/monitors.json`
- URL statistics are stored in `data/url-stats.json`
- Files are created automatically on first run

## Configuration

Edit `src/config.ts` to modify:
- URLs to monitor
- Cron schedules
- Timeout settings
- Retry configurations

## Example Usage

```bash
# Get current stats
curl http://localhost:3000/api/stats

# Get last 10 results
curl "http://localhost:3000/api/results?limit=10"

# Get results for specific URL
curl "http://localhost:3000/api/results/https%3A//example.com"

# Get URL statistics for all sites
curl http://localhost:3000/api/url-stats

# Get URL statistics for specific site
curl "http://localhost:3000/api/url-stats/https%3A//example.com"

# Refresh URL statistics
curl -X POST http://localhost:3000/api/url-stats/refresh
```

## Example API Responses

### URL Statistics Response (`/api/url-stats`)
```json
[
  {
    "URL": "https://example.com",
    "Uptime": "98.5%",
    "Interval": 0.17,
    "AvrageResponseTime": 245,
    "Status": "up",
    "lastError": ""
  },
  {
    "URL": "https://api.example.com",
    "Uptime": "99.2%",
    "Interval": 0.17,
    "AvrageResponseTime": 180,
    "Status": "up",
    "lastError": ""
  }
]
```

### Individual URL Statistics Response (`/api/url-stats/:url`)
```json
{
  "URL": "https://example.com",
  "Uptime": "98.5%",
  "Interval": 0.17,
  "AvrageResponseTime": 245,
  "Status": "up",
  "lastError": ""
}
```
