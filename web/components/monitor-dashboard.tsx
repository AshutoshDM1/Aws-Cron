"use client"

import useSWR from "swr"
import { useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { MonitorTable } from "./monitor-table"
import type { Monitor } from "@/types/monitor"
import { fetcher } from "@/lib/api"

export function MonitorDashboard() {
  const { data, isLoading, error, mutate } = useSWR<{ monitors: Monitor[] }>("/api/monitors", fetcher, {
    refreshInterval: 10000,
    revalidateOnFocus: false,
  })
  const [query, setQuery] = useState("")
  const [onlyDown, setOnlyDown] = useState(false)

  const filtered = useMemo(() => {
    const items = data?.monitors ?? []
    const q = query.trim().toLowerCase()
    const base = q
      ? items.filter((m) => (m.name || "").toLowerCase().includes(q) || m.url.toLowerCase().includes(q))
      : items
    return onlyDown ? base.filter((m) => m.status === "down") : base
  }, [data, query, onlyDown])

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between border-b border-primary/20">
          <CardTitle className="text-lg md:text-xl text-primary">Monitors</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant={onlyDown ? "default" : "outline"}
              onClick={() => setOnlyDown((v) => !v)}
              aria-pressed={onlyDown}
            >
              {onlyDown ? "Showing Down" : "Show Only Down"}
            </Button>
            <Button variant="outline" onClick={() => mutate()} title="Refresh now">
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <label htmlFor="search" className="sr-only">
              Search monitors
            </label>
            <Input
              id="search"
              placeholder="Search by name or URL…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="max-w-sm"
            />
          </div>

          {isLoading && <div className="text-sm text-muted-foreground">Loading monitors…</div>}
          {error && (
            <div className="text-sm text-destructive">Failed to load monitors. Check your backend configuration.</div>
          )}
          {!isLoading && !error && <MonitorTable monitors={filtered} />}
        </CardContent>
      </Card>
    </div>
  )
}
