export interface PingConfig {
  url: string;
  schedule: string;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
}

export interface PingResult {
  url: string;
  timestamp: Date;
  status: 'success' | 'failed';
  responseTime?: number;
  statusCode?: number;
  error?: string;
}

export interface PingStats {
  total: number;
  success: number;
  failed: number;
  avgResponseTime: number;
}
