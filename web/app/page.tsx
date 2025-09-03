import { Suspense } from "react"
import { MonitorDashboard } from "@/components/monitor-dashboard"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Card, CardContent } from "@/components/ui/card"

export default function HomePage() {
  return (
    <main className="p-6 md:p-10">
      <div className="max-w-6xl mx-auto space-y-6">
        <section className="rounded-xl bg-primary text-primary-foreground p-5 md:p-6">
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="text-xs md:text-sm/6 opacity-85">Dashboard</p>
              <h1 className="text-2xl md:text-3xl font-semibold text-balance">Uptime Monitor</h1>
              <p className="text-sm md:text-base opacity-90">
                Track availability, response time, and uptime across your sites.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/crons/new">
                <Button variant="secondary">Create Cron</Button>
              </Link>
              <ThemeToggle />
            </div>
          </div>
        </section>

        <Card>
          <CardContent className="p-4 md:p-6">
            <Suspense fallback={<div className="text-sm text-muted-foreground">Loading dashboard…</div>}>
              <MonitorDashboard />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
