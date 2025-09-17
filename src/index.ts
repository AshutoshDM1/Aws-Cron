import express from 'express';
import cors from 'cors';
import cron from 'node-cron';
import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';
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
  private dataDir = path.join(process.cwd(), 'data');
  private resultsFile = path.join(this.dataDir, 'results.json');
  private statsFile = path.join(this.dataDir, 'stats.json');

  constructor(configs: PingConfig[] = []) {
    this.configs = configs;
    this.initializeStorage();
    if (this.configs.length === 0) {
      console.log('⚠️  No ping configurations provided. Add some in config.ts');
    }
  }

  private async initializeStorage(): Promise<void> {
    try {
      await fs.mkdir(this.dataDir, { recursive: true });
      await this.loadResults();
    } catch (error) {
      console.error('Failed to initialize storage:', error);
    }
  }

  private async loadResults(): Promise<void> {
    try {
      const data = await fs.readFile(this.resultsFile, 'utf-8');
      this.results = JSON.parse(data).map((r: any) => ({
        ...r,
        timestamp: new Date(r.timestamp)
      }));
    } catch (error) {
      // File doesn't exist yet, start with empty results
      this.results = [];
    }
  }

  private async saveResults(): Promise<void> {
    try {
      await fs.writeFile(this.resultsFile, JSON.stringify(this.results, null, 2));
    } catch (error) {
      console.error('Failed to save results:', error);
    }
  }

  private async saveStats(): Promise<void> {
    try {
      const stats = this.getStats();
      await fs.writeFile(this.statsFile, JSON.stringify(stats, null, 2));
    } catch (error) {
      console.error('Failed to save stats:', error);
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
    await this.saveResults();
    await this.saveStats();
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

  getConfigs(): PingConfig[] {
    return this.configs;
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

// Express server setup
async function createServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;
  
  app.use(cors());
  app.use(express.json());
  
  const pinger = new SitePinger(siteConfigs);
  
  // Start cron jobs
  pinger.startCronJobs();
  
  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
  });
  
  app.get('/api/stats', (req, res) => {
    const stats = pinger.getStats();
    res.json(stats);
  });
  
  app.get('/api/results', (req, res) => {
    const limit = parseInt(req.query.limit as string) || 100;
    const results = pinger.getResults().slice(-limit);
    res.json(results);
  });
  
  app.get('/api/results/:url', (req, res) => {
    const url = decodeURIComponent(req.params.url);
    const limit = parseInt(req.query.limit as string) || 50;
    const results = pinger.getResults()
      .filter(r => r.url === url)
      .slice(-limit);
    res.json(results);
  });
  
  app.get('/api/configs', (req, res) => {
    res.json(pinger.getConfigs());
  });
  
  // Start server
  app.listen(PORT, () => {
    console.log('🌐 AWS Cron - Site Monitoring API Server');
    console.log('========================================');
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 API endpoints available at http://localhost:${PORT}/api`);
    console.log('🔄 Cron jobs are running in the background');
  });
  
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
  
  return app;
}

// Run the application
if (require.main === module) {
  createServer().catch(console.error);
}

export { SitePinger, PingConfig, PingResult };
