export type Monitor = {
  id: string
  url: string
  name?: string
  status: "up" | "down" | "unknown"
  lastChecked?: string
  responseTimeMs?: number
  uptimePercent24h?: number
  history?: { timestamp: string; status: "up" | "down"; responseTimeMs?: number }[]
}
