import { Router } from 'express';
import { MonitoringService } from '../services/MonitoringService';

export function createApiRoutes(monitoringService: MonitoringService): Router {
  const router = Router();

  // Health check
  router.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
  });

  // Get overall statistics
  router.get('/stats', (req, res) => {
    const stats = monitoringService.getStats();
    res.json(stats);
  });

  // Get recent ping results
  router.get('/results', (req, res) => {
    const limit = parseInt(req.query.limit as string) || 100;
    const results = monitoringService.getResults().slice(-limit);
    res.json(results);
  });

  // Get results for specific URL
  router.get('/results/:url', (req, res) => {
    const url = decodeURIComponent(req.params.url);
    const limit = parseInt(req.query.limit as string) || 50;
    const results = monitoringService.getResults()
      .filter(r => r.url === url)
      .slice(-limit);
    res.json(results);
  });

  // Get monitoring configurations
  router.get('/configs', (req, res) => {
    res.json(monitoringService.getConfigs());
  });

  return router;
}
