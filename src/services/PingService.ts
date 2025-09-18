import axios from 'axios';
import { PingConfig, PingResult } from '../types';

export class PingService {
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
    
    return lastResult!;
  }
}
