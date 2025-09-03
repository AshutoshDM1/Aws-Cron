import { Suspense } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { CronForm } from "@/components/cron-form"

export default function NewCronPage() {
  return (
    <main className="p-6 md:p-10">
      <div className="max-w-2xl mx-auto space-y-6">
        <header>
          <h1 className="text-2xl md:text-3xl font-semibold text-pretty">Create Cron Job</h1>
          <p className="text-sm text-muted-foreground mt-1">Add a site to monitor and set its check interval.</p>
        </header>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>New Monitor</CardTitle>
            <CardDescription>We’ll ping this URL on your schedule.</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div className="text-sm text-muted-foreground">Loading form…</div>}>
              <CronForm />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
