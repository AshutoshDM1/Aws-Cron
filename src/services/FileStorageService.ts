import fs from 'fs/promises';
import path from 'path';
import { PingResult, PingStats, PingConfig } from '../types';

export class FileStorageService {
  private dataDir = path.join(process.cwd(), 'data');
  private resultsFile = path.join(this.dataDir, 'results.json');
  private statsFile = path.join(this.dataDir, 'stats.json');
  private monitorsFile = path.join(this.dataDir, 'monitors.json');

  async initialize(): Promise<void> {
    try {
      await fs.mkdir(this.dataDir, { recursive: true });
    } catch (error) {
      console.error('Failed to initialize storage:', error);
      throw error;
    }
  }

  async loadResults(): Promise<PingResult[]> {
    try {
      const data = await fs.readFile(this.resultsFile, 'utf-8');
      return JSON.parse(data).map((r: any) => ({
        ...r,
        timestamp: new Date(r.timestamp)
      }));
    } catch (error) {
      // File doesn't exist yet, start with empty results
      return [];
    }
  }

  async saveResults(results: PingResult[]): Promise<void> {
    try {
      await fs.writeFile(this.resultsFile, JSON.stringify(results, null, 2));
    } catch (error) {
      console.error('Failed to save results:', error);
      throw error;
    }
  }

  async saveStats(stats: PingStats): Promise<void> {
    try {
      await fs.writeFile(this.statsFile, JSON.stringify(stats, null, 2));
    } catch (error) {
      console.error('Failed to save stats:', error);
      throw error;
    }
  }

  async loadMonitors(): Promise<PingConfig[]> {
    try {
      const data = await fs.readFile(this.monitorsFile, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.warn('Failed to load monitors config, using empty array:', error);
      return [];
    }
  }

  async saveMonitors(monitors: PingConfig[]): Promise<void> {
    try {
      await fs.writeFile(this.monitorsFile, JSON.stringify(monitors, null, 2));
      console.log('✅ Saved monitors configuration to file');
    } catch (error) {
      console.error('Failed to save monitors config:', error);
      throw error;
    }
  }
}
