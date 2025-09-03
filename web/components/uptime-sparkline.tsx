"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis } from "recharts"
import type { Monitor } from "@/types/monitor"

type Point = { t: number; up: number }
function toSeries(history: Monitor["history"]): Point[] {
  const items = (history || []).slice(-50)
  return items.map((h) => ({ t: new Date(h.timestamp).getTime(), up: h.status === "up" ? 1 : 0 }))
}

export function UptimeSparkline({ data }: { data: Monitor["history"] }) {
  const series = toSeries(data)
  if (!series.length) {
    return <div className="text-xs text-muted-foreground">No data</div>
  }
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={series} margin={{ left: 0, right: 0, top: 4, bottom: 0 }}>
        <XAxis dataKey="t" hide />
        <Tooltip
          labelFormatter={() => ""}
          formatter={(val) => (val === 1 ? "Up" : "Down")}
          contentStyle={{ fontSize: 12 }}
        />
        <Line
          type="monotone"
          dataKey="up"
          stroke="hsl(var(--primary))"
          strokeWidth={2}
          dot={false}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
