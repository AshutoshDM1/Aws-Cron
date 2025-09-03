import { Suspense } from "react"
import { MonitorDashboard } from "@/components/monitor-dashboard"

export default function MonitorsPage() {
  return (
    <main className="p-6 md:p-10">
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-semibold text-pretty bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Uptime Monitor
          </h1>
        </header>
        <Suspense fallback={<div className="text-sm text-muted-foreground">Loading dashboard…</div>}>
          <MonitorDashboard />
        </Suspense>
      </div>
    </main>
  )
}
