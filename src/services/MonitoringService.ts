import cron from 'node-cron';
import { PingConfig, PingResult, PingStats, URLStats } from '../types';
import { PingService } from './PingService';
import { FileStorageService } from './FileStorageService';

export class MonitoringService {
  private configs: PingConfig[] = [];
  private results: PingResult[] = [];
  private urlStats: URLStats[] = [];
  private pingService = new PingService();
  private storageService = new FileStorageService();
  private cronJobs: Map<string, any> = new Map(); // Store cron job references

  constructor(fallbackConfigs: PingConfig[] = []) {
    this.initialize(fallbackConfigs);
  }

  private async initialize(fallbackConfigs: PingConfig[] = []): Promise<void> {
    await this.storageService.initialize();
    this.results = await this.storageService.loadResults();
    this.urlStats = await this.storageService.loadURLStats();
    
    // Load monitors from JSON file, fallback to provided configs
    this.configs = await this.storageService.loadMonitors();
    
    if (this.configs.length === 0 && fallbackConfigs.length > 0) {
      console.log('📝 No monitors found in JSON file, using fallback configs');
      this.configs = fallbackConfigs;
      await this.storageService.saveMonitors(this.configs);
    }
    
    if (this.configs.length === 0) {
      console.log('⚠️  No ping configurations found. Add some through the API or web interface');
    } else {
      console.log(`📋 Loaded ${this.configs.length} monitor configuration(s)`);
    }

    // Initialize URL stats if they don't exist
    await this.updateURLStats();
  }

  async addPingConfig(config: PingConfig): Promise<void> {
    this.configs.push(config);
    await this.storageService.saveMonitors(this.configs);
    
    // Start cron job for the new monitor
    this.startCronJobForConfig(config);
    
    console.log(`Added ping config for ${config.url} with schedule: ${config.schedule}`);
  }

  async executePing(config: PingConfig): Promise<PingResult> {
    const result = await this.pingService.pingWithRetries(config);
    this.results.push(result);
    
    // Update URL stats
    await this.updateURLStats();
    
    // Save to file
    await this.storageService.saveResults(this.results);
    await this.storageService.saveStats(this.getStats());
    await this.storageService.saveURLStats(this.urlStats);
    
    return result;
  }

  startCronJobs(): void {
    if (this.configs.length === 0) {
      console.log('❌ No configurations to schedule. Please add some through the API or web interface');
      return;
    }

    console.log('🚀 Starting cron jobs for site monitoring...');
    
    this.configs.forEach(config => {
      this.startCronJobForConfig(config);
    });
  }

  private startCronJobForConfig(config: PingConfig): void {
    // Validate schedule before proceeding
    if (!config.schedule || typeof config.schedule !== 'string') {
      console.warn(`⚠️  Invalid or missing schedule for ${config.url}, skipping cron job creation`);
      return;
    }

    // Stop existing job if it exists
    const existingJob = this.cronJobs.get(config.url);
    if (existingJob) {
      existingJob.stop();
    }

    try {
      // Create and start new cron job
      const job = cron.schedule(config.schedule, async () => {
        console.log(`⏰ Executing scheduled ping for ${config.url}`);
        await this.executePing(config);
      }, {
        scheduled: true,
        timezone: "UTC"
      });
    
      this.cronJobs.set(config.url, job);
      console.log(`📅 Scheduled ping for ${config.url} with cron: ${config.schedule}`);
    } catch (error) {
      console.error(`❌ Failed to create cron job for ${config.url}:`, error);
      console.error(`   Schedule provided: "${config.schedule}"`);
    }
  }

  private stopCronJobForUrl(url: string): void {
    const job = this.cronJobs.get(url);
    if (job) {
      job.stop();
      this.cronJobs.delete(url);
      console.log(`🛑 Stopped cron job for ${url}`);
    }
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

  getMonitors(): any[] {
    return this.configs.map((config, index) => {
      const urlResults = this.results.filter(r => r.url === config.url);
      const recentResults = urlResults.slice(-24); // Last 24 results for 24h calculation
      const lastResult = urlResults[urlResults.length - 1];
      
      // Calculate uptime percentage for last 24 hours
      const successCount = recentResults.filter(r => r.status === 'success').length;
      const uptimePercent24h = recentResults.length > 0 ? Math.round((successCount / recentResults.length) * 100) : 0;
      
      // Determine current status
      let status: 'up' | 'down' | 'unknown' = 'unknown';
      if (lastResult) {
        status = lastResult.status === 'success' ? 'up' : 'down';
      }

      // Create history for last 12 hours with proper time slots
      const history = this.createTwelveHourHistory(urlResults);

      return {
        id: (index + 1).toString(),
        url: config.url,
        name: this.extractDomainName(config.url),
        status,
        lastChecked: lastResult?.timestamp?.toString(),
        responseTimeMs: lastResult?.responseTime,
        uptimePercent24h,
        history
      };
    });
  }

  private createTwelveHourHistory(urlResults: any[]): Array<{
    timestamp: string;
    status: 'up' | 'down';
    responseTimeMs: number;
  }> {
    const now = new Date();
    const twelveHoursAgo = new Date(now.getTime() - 12 * 60 * 60 * 1000);
    
    // Filter results to last 12 hours
    const last12HourResults = urlResults.filter(result => 
      new Date(result.timestamp) >= twelveHoursAgo
    ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    
    if (last12HourResults.length === 0) {
      return [];
    }
    
    // Instead of creating artificial slots, let's use actual data points
    // and only fill gaps intelligently
    const slots: Array<{
      timestamp: string;
      status: 'up' | 'down';
      responseTimeMs: number;
    }> = [];
    
    // Group results by time intervals (5-minute buckets)
    const timeGroups = new Map<string, any[]>();
    
    last12HourResults.forEach(result => {
      const resultTime = new Date(result.timestamp);
      // Round down to nearest 5-minute interval
      const roundedTime = new Date(resultTime);
      roundedTime.setMinutes(Math.floor(resultTime.getMinutes() / 5) * 5, 0, 0);
      const key = roundedTime.toISOString();
      
      if (!timeGroups.has(key)) {
        timeGroups.set(key, []);
      }
      timeGroups.get(key)!.push(result);
    });
    
    // Convert grouped data to slots, using the most recent data in each group
    const sortedGroups = Array.from(timeGroups.entries()).sort(([a], [b]) => 
      new Date(a).getTime() - new Date(b).getTime()
    );
    
    sortedGroups.forEach(([timeKey, results]) => {
      // Use the most recent result in this time group
      const mostRecent = results[results.length - 1];
      
      slots.push({
        timestamp: timeKey,
        status: mostRecent.status === 'success' ? 'up' as const : 'down' as const,
        responseTimeMs: mostRecent.responseTime || 0
      });
    });
    
    // Only fill small gaps (less than 30 minutes) with interpolated data
    const filledSlots: Array<{
      timestamp: string;
      status: 'up' | 'down';
      responseTimeMs: number;
    }> = [];
    
    for (let i = 0; i < slots.length; i++) {
      filledSlots.push(slots[i]);
      
      // Check if there's a gap to the next slot
      if (i < slots.length - 1) {
        const currentTime = new Date(slots[i].timestamp);
        const nextTime = new Date(slots[i + 1].timestamp);
        const gapMinutes = (nextTime.getTime() - currentTime.getTime()) / (1000 * 60);
        
        // Only fill gaps smaller than 30 minutes to avoid showing stale data
        if (gapMinutes > 5 && gapMinutes <= 30) {
          const gapSlots = Math.floor(gapMinutes / 5) - 1;
          
          for (let j = 1; j <= gapSlots; j++) {
            const interpolatedTime = new Date(currentTime.getTime() + j * 5 * 60 * 1000);
            
            // Use the current slot's data but mark it as potentially stale
            filledSlots.push({
              timestamp: interpolatedTime.toISOString(),
              status: slots[i].status,
              responseTimeMs: slots[i].responseTimeMs
            });
          }
        }
      }
    }
    
    return filledSlots;
  }

  private extractDomainName(url: string): string {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname;
    } catch {
      return url;
    }
  }

  async updateMonitor(url: string, updateData: Partial<PingConfig>): Promise<boolean> {
    const configIndex = this.configs.findIndex(c => c.url === url);
    if (configIndex === -1) {
      return false;
    }

    this.configs[configIndex] = { ...this.configs[configIndex], ...updateData };
    await this.storageService.saveMonitors(this.configs);
    
    // Restart cron job with new schedule if schedule changed
    if (updateData.schedule) {
      this.startCronJobForConfig(this.configs[configIndex]);
    }
    
    console.log(`Updated monitor config for ${url}`);
    return true;
  }

  async deleteMonitor(url: string): Promise<boolean> {
    const configIndex = this.configs.findIndex(c => c.url === url);
    if (configIndex === -1) {
      return false;
    }

    // Stop the cron job first
    this.stopCronJobForUrl(url);
    
    // Remove from configs
    this.configs.splice(configIndex, 1);
    await this.storageService.saveMonitors(this.configs);
    
    console.log(`Deleted monitor config for ${url}`);
    return true;
  }

  async reloadMonitors(): Promise<void> {
    console.log('🔄 Reloading monitor configurations...');
    
    // Stop all existing cron jobs
    this.cronJobs.forEach((job, url) => {
      job.stop();
      console.log(`🛑 Stopped cron job for ${url}`);
    });
    this.cronJobs.clear();
    
    // Reload configs from file
    this.configs = await this.storageService.loadMonitors();
    
    // Restart cron jobs
    this.startCronJobs();
    
    console.log(`✅ Reloaded ${this.configs.length} monitor configuration(s)`);
  }

  printStats(): void {
    const stats = this.getStats();
    console.log('\n📊 Ping Statistics:');
    console.log(`Total pings: ${stats.total}`);
    console.log(`Successful: ${stats.success}`);
    console.log(`Failed: ${stats.failed}`);
    console.log(`Average response time: ${stats.avgResponseTime}ms`);
  }

  async updateURLStats(): Promise<void> {
    this.urlStats = this.configs.map(config => {
      const urlResults = this.results.filter(r => r.url === config.url);
      const recentResults = urlResults.slice(-100); // Last 100 results
      const lastResult = urlResults[urlResults.length - 1];
      
      // Calculate uptime percentage
      const successCount = recentResults.filter(r => r.status === 'success').length;
      const uptimePercent = recentResults.length > 0 ? Math.round((successCount / recentResults.length) * 100) : 0;
      
      // Calculate average response time
      const responseTimes = recentResults.filter(r => r.responseTime).map(r => r.responseTime!);
      const avgResponseTime = responseTimes.length > 0 
        ? Math.round(responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length)
        : 0;
      
      // Get interval from cron schedule (convert to minutes for display)
      const interval = this.cronScheduleToMinutes(config.schedule);
      
      // Calculate total uptime duration
      const totalUptime = this.calculateTotalUptime(urlResults);
      
      // Determine current status
      let status = 'unknown';
      let lastError = '';
      
      if (lastResult) {
        status = lastResult.status === 'success' ? 'up' : 'down';
        if (lastResult.error) {
          lastError = lastResult.error;
        }
      }
      
      return {
        URL: config.url,
        Uptime: `${uptimePercent}%`,
        Interval: interval,
        AvrageResponseTime: avgResponseTime,
        Status: status,
        lastError: lastError,
        totalUptime: totalUptime
      };
    });
  }

  private cronScheduleToMinutes(schedule: string | undefined): number {
    // Simple conversion for common patterns
    // */10 * * * * * = every 10 seconds = 0.17 minutes
    // */5 * * * * = every 5 minutes = 5 minutes
    // 0 */10 * * * = every 10 minutes = 10 minutes
    
    if (!schedule) return 5; // Default if no schedule provided
    
    if (schedule.includes('*/10 * * * * *')) return 0.17; // 10 seconds
    if (schedule.includes('*/30 * * * * *')) return 0.5;  // 30 seconds
    if (schedule.includes('*/1 * * * *')) return 1;       // 1 minute
    if (schedule.includes('*/5 * * * *')) return 5;       // 5 minutes
    if (schedule.includes('*/10 * * * *')) return 10;     // 10 minutes
    if (schedule.includes('*/15 * * * *')) return 15;     // 15 minutes
    if (schedule.includes('*/30 * * * *')) return 30;     // 30 minutes
    
    return 5; // Default to 5 minutes
  }

  private calculateTotalUptime(urlResults: any[]): string {
    if (urlResults.length === 0) {
      return '0 Minutes';
    }
    
    // Find first and last timestamps
    const timestamps = urlResults.map(r => new Date(r.timestamp)).sort((a, b) => a.getTime() - b.getTime());
    const startTime = timestamps[0];
    const endTime = timestamps[timestamps.length - 1];
    
    // Calculate duration
    const durationMs = endTime.getTime() - startTime.getTime();
    const totalMinutes = Math.floor(durationMs / (1000 * 60));
    
    const days = Math.floor(totalMinutes / (24 * 60));
    const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
    const minutes = totalMinutes % 60;
    
    let formatted = '';
    if (days > 0) formatted += `${days} Day${days !== 1 ? 's' : ''}`;
    if (hours > 0) {
      if (formatted) formatted += ' ';
      formatted += `${hours} Hour${hours !== 1 ? 's' : ''}`;
    }
    if (minutes > 0) {
      if (formatted) formatted += ' ';
      formatted += `${minutes} Minute${minutes !== 1 ? 's' : ''}`;
    }
    
    return formatted || '0 Minutes';
  }

  getURLStats(): URLStats[] {
    return this.urlStats;
  }

  async getURLStatsByUrl(url: string): Promise<URLStats | null> {
    const stats = this.urlStats.find(stat => stat.URL === url);
    return stats || null;
  }
}
