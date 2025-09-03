"use client"

import { toast as sonnerToast } from "sonner"

type ToastVariant = "default" | "destructive" | "success"

interface ToastProps {
  title?: string
  description?: string
  variant?: ToastVariant
}

export function useToast() {
  const toast = ({ title, description, variant = "default" }: ToastProps) => {
    const message = title || ""
    const desc = description || ""

    switch (variant) {
      case "destructive":
        return sonnerToast.error(message, { description: desc })
      case "success":
        return sonnerToast.success(message, { description: desc })
      default:
        return sonnerToast(message, { description: desc })
    }
  }

  return { toast }
}
