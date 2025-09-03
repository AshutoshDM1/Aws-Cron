"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

type CronPayload = {
  name?: string
  url: string
  intervalMinutes: number
  method: "GET" | "HEAD"
}

export function CronForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = React.useState(false)

  const onSubmit = async (formData: FormData) => {
    const payload: CronPayload = {
      name: String(formData.get("name") || "").trim() || undefined,
      url: String(formData.get("url") || "").trim(),
      intervalMinutes: Number(formData.get("intervalMinutes") || 5),
      method: String(formData.get("method") || "GET").toUpperCase() as "GET" | "HEAD",
    }

    if (!payload.url || Number.isNaN(payload.intervalMinutes) || payload.intervalMinutes <= 0) {
      toast({ title: "Invalid input", description: "Please provide a valid URL and interval.", variant: "destructive" })
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/crons", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const errText = await res.text()
        throw new Error(errText || `Request failed with ${res.status}`)
      }
      toast({ title: "Cron created", description: "Your monitor has been scheduled." })
      router.push("/")
      router.refresh()
    } catch (err: any) {
      toast({
        title: "Failed to create cron",
        description: err?.message || "Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form action={onSubmit} className="space-y-5" aria-label="Create Cron Job">
      <div className="grid gap-2">
        <Label htmlFor="name">Name (optional)</Label>
        <Input id="name" name="name" placeholder="My Site" />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="url">Target URL</Label>
        <Input id="url" name="url" type="url" inputMode="url" required placeholder="https://example.com" />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="method">HTTP Method</Label>
        <Select name="method" defaultValue="GET">
          <SelectTrigger id="method" aria-label="HTTP method">
            <SelectValue placeholder="Select method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="GET">GET</SelectItem>
            <SelectItem value="HEAD">HEAD</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="intervalMinutes">Check Interval (minutes)</Label>
        <Input id="intervalMinutes" name="intervalMinutes" type="number" min={1} step={1} defaultValue={5} required />
      </div>

      <div className="flex items-center justify-end gap-3">
        <Button type="submit" disabled={loading}>
          {loading ? "Creating…" : "Create Cron"}
        </Button>
      </div>
    </form>
  )
}
