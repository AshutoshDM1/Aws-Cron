import express from 'express';
import cors from 'cors';
import { MonitoringService } from './services/MonitoringService';
import { createApiRoutes } from './routes/api';
import { siteConfigs } from './config';

export async function createServer() {
  const app = express();
  const PORT = process.env.PORT || 4000;
  
  // Middleware
  app.use(cors());
  app.use(express.json());
  
  // Initialize monitoring service
  const monitoringService = new MonitoringService(siteConfigs);
  
  // Start cron jobs
  monitoringService.startCronJobs();
  
  // API Routes
  app.use('/api', createApiRoutes(monitoringService));
  
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
    monitoringService.printStats();
  }, 10 * 60 * 1000);
  
  // Handle graceful shutdown
  process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down gracefully...');
    monitoringService.printStats();
    process.exit(0);
  });
  
  return app;
}
