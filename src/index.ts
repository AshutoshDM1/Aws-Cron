import cron from 'node-cron';
import axios from 'axios';
import { siteConfigs } from './config';

interface PingConfig {
  url: string;
  schedule: string;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
}

interface PingResult {
  url: string;
  timestamp: Date;
  status: 'success' | 'failed';
  responseTime?: number;
  statusCode?: number;
  error?: string;
}

class SitePinger {
  private configs: PingConfig[] = [];
  private results: PingResult[] = [];

  constructor(configs: PingConfig[] = []) {
    this.configs = configs;
    if (this.configs.length === 0) {
      console.log('⚠️  No ping configurations provided. Add some in config.ts');
    }
  }

  addPingConfig(config: PingConfig): void {
    this.configs.push(config);
    console.log(`Added ping config for ${config.url} with schedule: ${config.schedule}`);
  }

  async pingSite(config: PingConfig): Promise<PingResult> {
    const startTime = Date.now();
    
    try {
      const response = await axios.get(config.url, {
        timeout: config.timeout || 10000,
        validateStatus: () => true // Accept all status codes
      });
      
      const responseTime = Date.now() - startTime;
      
      const result: PingResult = {
        url: config.url,
        timestamp: new Date(),
        status: 'success',
        responseTime,
        statusCode: response.status
      };
      
      console.log(`✅ ${config.url} - Status: ${response.status}, Response Time: ${responseTime}ms`);
      return result;
      
    } catch (error: any) {
      const result: PingResult = {
        url: config.url,
        timestamp: new Date(),
        status: 'failed',
        error: error.message || 'Unknown error'
      };
      
      console.log(`❌ ${config.url} - Error: ${error.message}`);
      return result;
    }
  }

  async pingWithRetries(config: PingConfig): Promise<PingResult> {
    let lastResult: PingResult;
    
    for (let attempt = 1; attempt <= (config.retries || 1); attempt++) {
      if (attempt > 1) {
        console.log(`Retry attempt ${attempt} for ${config.url}`);
        await new Promise(resolve => setTimeout(resolve, config.retryDelay || 1000));
      }
      
      lastResult = await this.pingSite(config);
      
      if (lastResult.status === 'success') {
        break;
      }
    }
    
    this.results.push(lastResult!);
    return lastResult!;
  }

  startCronJobs(): void {
    if (this.configs.length === 0) {
      console.log('❌ No configurations to schedule. Please add some in config.ts');
      return;
    }

    console.log('🚀 Starting cron jobs for site monitoring...');
    
    this.configs.forEach(config => {
      cron.schedule(config.schedule, async () => {
        console.log(`\n⏰ Executing scheduled ping for ${config.url}`);
        await this.pingWithRetries(config);
      }, {
        scheduled: true,
        timezone: "UTC"
      });
      
      console.log(`📅 Scheduled ping for ${config.url} with cron: ${config.schedule}`);
    });
  }

  getResults(): PingResult[] {
    return this.results;
  }

  getStats(): { total: number; success: number; failed: number; avgResponseTime: number } {
    const total = this.results.length;
    const success = this.results.filter(r => r.status === 'success').length;
    const failed = total - success;
    const avgResponseTime = this.results
      .filter(r => r.responseTime)
      .reduce((sum, r) => sum + (r.responseTime || 0), 0) / 
      this.results.filter(r => r.responseTime).length || 0;
    
    return { total, success, failed, avgResponseTime: Math.round(avgResponseTime) };
  }

  printStats(): void {
    const stats = this.getStats();
    console.log('\n📊 Ping Statistics:');
    console.log(`Total pings: ${stats.total}`);
    console.log(`Successful: ${stats.success}`);
    console.log(`Failed: ${stats.failed}`);
    console.log(`Average response time: ${stats.avgResponseTime}ms`);
  }
}

// Main application function
async function main() {
  console.log('🌐 AWS Cron - Site Monitoring Service');
  console.log('=====================================\n');
  
  const pinger = new SitePinger(siteConfigs);
  
  // Start the cron jobs
  pinger.startCronJobs();
  
  // Keep the process running
  console.log('\n🔄 Cron jobs are running. Press Ctrl+C to stop.');
  
  // Print stats every 10 minutes
  setInterval(() => {
    pinger.printStats();
  }, 10 * 60 * 1000);
  
  // Handle graceful shutdown
  process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down gracefully...');
    pinger.printStats();
    process.exit(0);
  });
}

// Run the application
if (require.main === module) {
  main().catch(console.error);
}

export { SitePinger, PingConfig, PingResult };
