"use client"

import { Badge } from "@/components/ui/badge"

export function StatusBadge({ status }: { status: "up" | "down" | "unknown" }) {
  if (status === "up") return <Badge className="bg-success hover:bg-success text-success-foreground">Up</Badge>
  if (status === "down")
    return <Badge className="bg-destructive hover:bg-destructive text-destructive-foreground">Down</Badge>
  return <Badge variant="secondary">Unknown</Badge>
}
