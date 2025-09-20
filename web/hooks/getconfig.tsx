import { useState, useEffect } from 'react';

interface Config {
    url: string,
    schedule: string,
    timeout: number,
    retries: number,
    retryDelay: number
}

export function useMonitoredConfigs() {
  const [configs, setConfigs] = useState<Config[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);

  useEffect(() => {
    async function fetchConfigs() {
      setLoading(true);
      setError(null);
      try {
        // TODO: Update the API URL as needed
        const res = await fetch('http://localhost:4000/api/configs');
        if (!res.ok) {
          throw new Error(`Failed to fetch configs: ${res.status}`);
        }
        const data = await res.json();
        setConfigs(data);
      } catch (err: any) {
        setError(err.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    }
    fetchConfigs();
  }, []);

  return { configs, loading, error };
}
