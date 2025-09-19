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

  // Reload monitors from JSON file
  router.post('/reload', async (req, res) => {
    try {
      await monitoringService.reloadMonitors();
      res.json({ message: 'Monitors reloaded successfully' });
    } catch (error) {
      console.error('Error reloading monitors:', error);
      res.status(500).json({ error: 'Failed to reload monitors' });
    }
  });

  // Get monitors in frontend-compatible format
  router.get('/monitors', (req, res) => {
    const monitors = monitoringService.getMonitors();
    res.json(monitors);
  });

  // Add new monitor
  router.post('/monitors', async (req, res) => {
    try {
      const { url, schedule, timeout, retries, retryDelay } = req.body;
      
      if (!url || !schedule) {
        return res.status(400).json({ error: 'URL and schedule are required' });
      }

      const config = {
        url,
        schedule,
        timeout: timeout || 10000,
        retries: retries || 3,
        retryDelay: retryDelay || 30000
      };

      await monitoringService.addPingConfig(config);
      res.status(201).json({ message: 'Monitor added successfully', config });
    } catch (error) {
      console.error('Error adding monitor:', error);
      res.status(500).json({ error: 'Failed to add monitor' });
    }
  });

  // Update monitor
  router.put('/monitors/:url', async (req, res) => {
    try {
      const url = decodeURIComponent(req.params.url);
      const updateData = req.body;
      
      const success = await monitoringService.updateMonitor(url, updateData);
      
      if (success) {
        res.json({ message: 'Monitor updated successfully' });
      } else {
        res.status(404).json({ error: 'Monitor not found' });
      }
    } catch (error) {
      console.error('Error updating monitor:', error);
      res.status(500).json({ error: 'Failed to update monitor' });
    }
  });

  // Delete monitor
  router.delete('/monitors/:url', async (req, res) => {
    try {
      const url = decodeURIComponent(req.params.url);
      const success = await monitoringService.deleteMonitor(url);
      
      if (success) {
        res.json({ message: 'Monitor deleted successfully' });
      } else {
        res.status(404).json({ error: 'Monitor not found' });
      }
    } catch (error) {
      console.error('Error deleting monitor:', error);
      res.status(500).json({ error: 'Failed to delete monitor' });
    }
  });

  // Trigger manual ping for a monitor
  router.post('/monitors/:url/ping', async (req, res) => {
    try {
      const url = decodeURIComponent(req.params.url);
      const config = monitoringService.getConfigs().find(c => c.url === url);
      
      if (!config) {
        return res.status(404).json({ error: 'Monitor not found' });
      }

      const result = await monitoringService.executePing(config);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'Failed to ping monitor' });
    }
  });

  return router;
}
