import { createServer } from './server';

// Run the application
if (require.main === module) {
  createServer().catch(console.error);
}

// Re-export types and services for external use
export * from './types';
export { MonitoringService } from './services/MonitoringService';
export { PingService } from './services/PingService';
export { FileStorageService } from './services/FileStorageService';
