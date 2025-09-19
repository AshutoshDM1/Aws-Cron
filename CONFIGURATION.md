# Monitor Configuration System

The monitoring system now uses a JSON-based configuration that persists changes automatically.

## Configuration File

**Location:** `data/monitors.json`

This file contains an array of monitor configurations:

```json
[
  {
    "url": "https://example.com",
    "schedule": "*/30 * * * * *",
    "timeout": 10000,
    "retries": 3,
    "retryDelay": 30000
  }
]
```

## Configuration Properties

- **url** (string, required): The URL to monitor
- **schedule** (string, required): Cron schedule expression
- **timeout** (number, optional): Request timeout in milliseconds (default: 10000)
- **retries** (number, optional): Number of retry attempts (default: 3)
- **retryDelay** (number, optional): Delay between retries in milliseconds (default: 30000)

## Schedule Examples

| Schedule | Description |
|----------|-------------|
| `*/10 * * * * *` | Every 10 seconds |
| `*/30 * * * * *` | Every 30 seconds |
| `*/1 * * * *` | Every minute |
| `*/5 * * * *` | Every 5 minutes |
| `*/15 * * * *` | Every 15 minutes |
| `0 */1 * * *` | Every hour |

## How It Works

1. **Startup**: The system loads monitors from `data/monitors.json`
2. **Fallback**: If the JSON file doesn't exist, it uses configs from `src/config.ts` as fallback
3. **Persistence**: All changes via API or web interface are automatically saved to the JSON file
4. **Cron Jobs**: Adding/updating/deleting monitors automatically manages cron jobs

## API Operations

### Add Monitor
```bash
POST /api/monitors
Content-Type: application/json

{
  "url": "https://new-site.com",
  "schedule": "*/30 * * * * *",
  "timeout": 10000,
  "retries": 3,
  "retryDelay": 30000
}
```

### Update Monitor
```bash
PUT /api/monitors/https%3A%2F%2Fexample.com
Content-Type: application/json

{
  "schedule": "*/60 * * * * *",
  "timeout": 15000
}
```

### Delete Monitor
```bash
DELETE /api/monitors/https%3A%2F%2Fexample.com
```

### Reload Configuration
```bash
POST /api/reload
```

## Benefits

✅ **Persistent**: Changes survive server restarts
✅ **Dynamic**: Add/remove monitors without restarting
✅ **Automatic**: Cron jobs are managed automatically
✅ **API-Driven**: Full CRUD operations via REST API
✅ **Web Interface**: Manage monitors through the dashboard

## Migration from config.ts

The system automatically migrates existing configurations from `src/config.ts` to `data/monitors.json` on first run. After migration, all changes should be made through the API or web interface to ensure persistence.
