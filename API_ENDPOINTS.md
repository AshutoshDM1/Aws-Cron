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

## Data Storage

- Results are stored in `data/results.json`
- Stats are stored in `data/stats.json`
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
```
