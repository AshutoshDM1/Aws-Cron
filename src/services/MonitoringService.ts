import cron from 'node-cron';
import { PingConfig, PingResult, PingStats } from '../types';
import { PingService } from './PingService';
import { FileStorageService } from './FileStorageService';

export class MonitoringService {
  private configs: PingConfig[] = [];
  private results: PingResult[] = [];
  private pingService = new PingService();
  private storageService = new FileStorageService();

  constructor(configs: PingConfig[] = []) {
    this.configs = configs;
    this.initialize();
    
    if (this.configs.length === 0) {
      console.log('⚠️  No ping configurations provided. Add some in config.ts');
    }
  }

  private async initialize(): Promise<void> {
    await this.storageService.initialize();
    this.results = await this.storageService.loadResults();
  }

  addPingConfig(config: PingConfig): void {
    this.configs.push(config);
    console.log(`Added ping config for ${config.url} with schedule: ${config.schedule}`);
  }

  async executePing(config: PingConfig): Promise<PingResult> {
    const result = await this.pingService.pingWithRetries(config);
    this.results.push(result);
    
    // Save to file
    await this.storageService.saveResults(this.results);
    await this.storageService.saveStats(this.getStats());
    
    return result;
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
        await this.executePing(config);
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

  getStats(): PingStats {
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
