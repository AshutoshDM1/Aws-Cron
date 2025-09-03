"use client"

import Link from "next/link"
import useSWR from "swr"
import type { Monitor } from "@/types/monitor"
import { StatusBadge } from "./status-badge"
import { UptimeSparkline } from "./uptime-sparkline"
import { fetcher } from "@/lib/api"
import { cn } from "@/lib/utils"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

type Props = {
  monitors: Monitor[]
}

function timeAgo(iso?: string) {
  if (!iso) return "—"
  const ts = new Date(iso).getTime()
  const delta = Date.now() - ts
  const sec = Math.floor(delta / 1000)
  if (sec < 60) return `${sec}s ago`
  const min = Math.floor(sec / 60)
  if (min < 60) return `${min}m ago`
  const hr = Math.floor(min / 60)
  if (hr < 24) return `${hr}h ago`
  const d = Math.floor(hr / 24)
  return `${d}d ago`
}

export function MonitorTable({ monitors }: Props) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[220px]">Site</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last Check</TableHead>
            <TableHead className="text-right">Resp. Time</TableHead>
            <TableHead className="text-right">Uptime 24h</TableHead>
            <TableHead className="min-w-[180px]">Last 24h</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {monitors.map((m) => (
            <MonitorRow key={m.id} monitor={m} />
          ))}
          {monitors.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-sm text-muted-foreground">
                No monitors found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

function MonitorRow({ monitor }: { monitor: Monitor }) {
  const { data } = useSWR<{ history: Monitor["history"] }>(
    monitor ? `/api/monitors/${monitor.id}/history` : null,
    fetcher,
    { refreshInterval: 30000, revalidateOnFocus: false },
  )
  return (
    <TableRow className={cn(monitor.status === "down" ? "bg-destructive/5 dark:bg-destructive/10" : undefined)}>
      <TableCell className="align-top">
        <div className="flex flex-col">
          <span className="font-medium text-pretty">{monitor.name || monitor.url}</span>
          <Link
            href={monitor.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-muted-foreground hover:underline"
          >
            {monitor.url}
          </Link>
        </div>
      </TableCell>
      <TableCell className="align-top">
        <StatusBadge status={monitor.status} />
      </TableCell>
      <TableCell className="align-top text-sm text-muted-foreground">{timeAgo(monitor.lastChecked)}</TableCell>
      <TableCell className="align-top text-right">
        <span className="text-sm">{monitor.responseTimeMs ? `${monitor.responseTimeMs} ms` : "—"}</span>
      </TableCell>
      <TableCell className="align-top text-right">
        <span className="text-sm">
          {monitor.uptimePercent24h != null ? `${monitor.uptimePercent24h.toFixed(2)}%` : "—"}
        </span>
      </TableCell>
      <TableCell className="align-top">
        <div className="h-[44px]">
          <UptimeSparkline data={data?.history || monitor.history || []} />
        </div>
      </TableCell>
    </TableRow>
  )
}
