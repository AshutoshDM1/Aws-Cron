import { PingConfig } from './index';

// Configuration for sites to ping
export const siteConfigs: PingConfig[] = [
  {
    url: 'https://backend-syndicate.onrender.com',
    schedule: '*/10 * * * * *', // Every 10 seconds
    timeout: 10000, // 10 seconds
    retries: 3,
    retryDelay: 1000 // 1 second
  },
  {
    url: 'https://elitedev.tech',
    schedule: '*/10 * * * * *', // Every 10 seconds
    timeout: 10000, // 10 seconds
    retries: 3,
    retryDelay: 1000 // 1 second
  },
];

// Cron schedule examples:
// '*/5 * * * *'     - Every 5 minutes
// '*/15 * * * *'    - Every 15 minutes
// '0 */1 * * *'     - Every hour
// '0 9 * * *'       - Every day at 9 AM
// '0 9 * * 1-5'     - Weekdays at 9 AM
// '0 0 * * 0'       - Every Sunday at midnight

// Timeout values (in milliseconds):
// 5000  - 5 seconds
// 10000 - 10 seconds
// 30000 - 30 seconds

// Retry configuration:
// retries: Number of attempts if ping fails
// retryDelay: Delay between retries in milliseconds
