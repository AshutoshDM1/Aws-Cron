# AWS Cron - Site Monitoring Service

A Node.js application that creates cron jobs to ping websites at scheduled intervals, providing monitoring and health checks for your web services.

## Features

- 🕐 **Flexible Scheduling**: Use cron expressions to define when to ping sites
- 🔄 **Automatic Retries**: Configure retry attempts with custom delays
- ⏱️ **Response Time Monitoring**: Track how long each site takes to respond
- 📊 **Statistics**: View success/failure rates and average response times
- 🛡️ **Error Handling**: Graceful handling of network errors and timeouts
- ⚙️ **Easy Configuration**: Simple configuration file for managing multiple sites

## Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd Aws-Cron
```

2. Install dependencies:
```bash
pnpm install
```

## Configuration

Edit `src/config.ts` to configure which sites to monitor:

```typescript
export const siteConfigs: PingConfig[] = [
  {
    url: 'https://your-site.com',
    schedule: '*/5 * * * *', // Every 5 minutes
    timeout: 10000,          // 10 seconds
    retries: 3,              // 3 retry attempts
    retryDelay: 1000         // 1 second between retries
  }
];
```

### Cron Schedule Examples

| Schedule | Description |
|----------|-------------|
| `*/5 * * * *` | Every 5 minutes |
| `*/15 * * * *` | Every 15 minutes |
| `0 */1 * * *` | Every hour |
| `0 9 * * *` | Every day at 9 AM |
| `0 9 * * 1-5` | Weekdays at 9 AM |
| `0 0 * * 0` | Every Sunday at midnight |

### Configuration Options

- **url**: The website URL to ping
- **schedule**: Cron expression for timing
- **timeout**: Maximum time to wait for response (milliseconds)
- **retries**: Number of retry attempts if ping fails
- **retryDelay**: Delay between retries (milliseconds)

## Usage

### Development Mode
```bash
pnpm run dev
```

### Production Mode
```bash
pnpm run build
pnpm start
```

### Custom Usage
```typescript
import { SitePinger } from './src/index';

const pinger = new SitePinger([
  {
    url: 'https://example.com',
    schedule: '*/10 * * * *',
    timeout: 5000,
    retries: 2
  }
]);

pinger.startCronJobs();
```

## Output

The application provides real-time feedback:

```
🌐 AWS Cron - Site Monitoring Service
=====================================

🚀 Starting cron jobs for site monitoring...
📅 Scheduled ping for https://www.google.com with cron: */5 * * * *
📅 Scheduled ping for https://httpbin.org/status/200 with cron: */2 * * * *
📅 Scheduled ping for https://example.com with cron: 0 */1 * * * *

🔄 Cron jobs are running. Press Ctrl+C to stop.

⏰ Executing scheduled ping for https://www.google.com
✅ https://www.google.com - Status: 200, Response Time: 245ms

📊 Ping Statistics:
Total pings: 1
Successful: 1
Failed: 0
Average response time: 245ms
```

## Monitoring

The application automatically tracks:
- Success/failure rates
- Response times
- Error messages
- Retry attempts

Statistics are displayed every 10 minutes and when the application shuts down.

## Deployment

### Local Development
- Use `pnpm run dev` for development with hot reloading
- Perfect for testing configurations

### Production
- Build with `pnpm run build`
- Run with `pnpm start`
- Consider using PM2 or similar process managers for production

### AWS Deployment
- Package as a Lambda function
- Use EventBridge for cron scheduling
- Deploy to EC2 with systemd services
- Use ECS with scheduled tasks

## Troubleshooting

### Common Issues

1. **Module not found errors**: Run `pnpm install` to install dependencies
2. **Permission denied**: Ensure you have write permissions for the project directory
3. **Port conflicts**: The application doesn't use ports, but ensure no other cron services are running

### Debug Mode
Add more verbose logging by modifying the console.log statements in the code.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

ISC License - see package.json for details

## Support

For issues and questions:
- Check the configuration examples
- Review the cron expression syntax
- Ensure all dependencies are properly installed