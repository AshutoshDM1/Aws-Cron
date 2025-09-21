import { useState, useEffect, useCallback } from 'react'
import { Monitor, URLStats } from '@/types/monitor'
import { monitorApi } from '@/lib/api'

interface UseMonitorsReturn {
  monitors: Monitor[]
  UrlStats: URLStats[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
  addMonitor: (monitorData: {
    url: string
    schedule: string
    timeout?: number
    retries?: number
    retryDelay?: number
  }) => Promise<void>
  updateMonitor: (url: string, updateData: any) => Promise<void>
  deleteMonitor: (url: string) => Promise<void>
  pingMonitor: (url: string) => Promise<void>
  getUrlStats: () => Promise<void>

}

export function useMonitors(): UseMonitorsReturn {
  const [monitors, setMonitors] = useState<Monitor[]>([])
  const [UrlStats, setUrlStats] = useState<URLStats[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMonitors = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await monitorApi.getMonitors()
      setMonitors(data)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch monitors')
      console.error('Error fetching monitors:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const getUrlStats = useCallback(async () => {
    try {
      const data = await monitorApi.UrlStats()
      setUrlStats(data)
    } catch (err: any) {
      throw new Error(err.message || 'Failed to get url stats')
    }
  }, [])
  
  const addMonitor = useCallback(async (monitorData: {
    url: string
    schedule: string
    timeout?: number
    retries?: number
    retryDelay?: number
  }) => {
    try {
      await monitorApi.addMonitor(monitorData)
      await fetchMonitors() // Refetch to get updated list
      await getUrlStats() // Refetch URL stats
    } catch (err: any) {
      throw new Error(err.message || 'Failed to add monitor')
    }
  }, [fetchMonitors, getUrlStats])

  const updateMonitor = useCallback(async (url: string, updateData: any) => {
    try {
      await monitorApi.updateMonitor(url, updateData)
      await fetchMonitors() // Refetch to get updated list
      await getUrlStats() // Refetch URL stats
    } catch (err: any) {
      throw new Error(err.message || 'Failed to update monitor')
    }
  }, [fetchMonitors, getUrlStats])

  const deleteMonitor = useCallback(async (url: string) => {
    try {
      await monitorApi.deleteMonitor(url)
      await fetchMonitors() // Refetch to get updated list
      await getUrlStats() // Refetch URL stats
    } catch (err: any) {
      throw new Error(err.message || 'Failed to delete monitor')
    }
  }, [fetchMonitors, getUrlStats])

  const pingMonitor = useCallback(async (url: string) => {
    try {
      await monitorApi.pingMonitor(url)
      // Optionally refetch to get updated status
      setTimeout(() => {
        fetchMonitors()
        getUrlStats()
      }, 1000) // Wait a bit for the ping to complete
    } catch (err: any) {
      throw new Error(err.message || 'Failed to ping monitor')
    }
  }, [fetchMonitors, getUrlStats])



  useEffect(() => {
    fetchMonitors()
    getUrlStats()
  }, [fetchMonitors])

  return {
    monitors,
    UrlStats,
    loading,
    error,
    refetch: fetchMonitors,
    addMonitor,
    updateMonitor,
    deleteMonitor,
    pingMonitor,
    getUrlStats
  }
}