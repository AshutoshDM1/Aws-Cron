import { Monitor } from "@/types/monitor"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'

export async function fetcher(input: RequestInfo, init?: RequestInit) {
  const res = await fetch(input, init)
  if (!res.ok) {
    const text = await res.text().catch(() => "")
    throw new Error(text || `Request failed: ${res.status}`)
  }
  return res.json()
}

// Monitor API functions
export const monitorApi = {
  // Get all monitors
  async getMonitors(): Promise<Monitor[]> {
    return fetcher(`${API_BASE_URL}/monitors`)
  },

  // Get monitor configurations
  async getConfigs() {
    return fetcher(`${API_BASE_URL}/configs`)
  },

  // Get overall stats
  async getStats() {
    return fetcher(`${API_BASE_URL}/stats`)
  },

  // Get ping results
  async getResults(limit?: number) {
    const url = limit ? `${API_BASE_URL}/results?limit=${limit}` : `${API_BASE_URL}/results`
    return fetcher(url)
  },

  // Get results for specific URL
  async getResultsForUrl(url: string, limit?: number) {
    const encodedUrl = encodeURIComponent(url)
    const resultUrl = limit 
      ? `${API_BASE_URL}/results/${encodedUrl}?limit=${limit}` 
      : `${API_BASE_URL}/results/${encodedUrl}`
    return fetcher(resultUrl)
  },

  // Add new monitor
  async addMonitor(monitorData: {
    url: string
    schedule: string
    timeout?: number
    retries?: number
    retryDelay?: number
  }) {
    return fetcher(`${API_BASE_URL}/monitors`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(monitorData),
    })
  },

  // Update monitor
  async updateMonitor(url: string, updateData: any) {
    const encodedUrl = encodeURIComponent(url)
    return fetcher(`${API_BASE_URL}/monitors/${encodedUrl}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    })
  },

  // Delete monitor
  async deleteMonitor(url: string) {
    const encodedUrl = encodeURIComponent(url)
    return fetcher(`${API_BASE_URL}/monitors/${encodedUrl}`, {
      method: 'DELETE',
    })
  },

  // Trigger manual ping
  async pingMonitor(url: string) {
    const encodedUrl = encodeURIComponent(url)
    return fetcher(`${API_BASE_URL}/monitors/${encodedUrl}/ping`, {
      method: 'POST',
    })
  },

  // Health check
  async healthCheck() {
    return fetcher(`${API_BASE_URL}/health`)
  },
}
