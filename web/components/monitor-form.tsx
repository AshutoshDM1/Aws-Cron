"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface MonitorFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: {
    url: string
    schedule: string
    timeout?: number
    retries?: number
    retryDelay?: number
  }) => Promise<void>
}

const scheduleOptions = [
  { value: '*/10 * * * * *', label: 'Every 10 seconds' },
  { value: '*/30 * * * * *', label: 'Every 30 seconds' },
  { value: '*/1 * * * *', label: 'Every minute' },
  { value: '*/5 * * * *', label: 'Every 5 minutes' },
  { value: '*/15 * * * *', label: 'Every 15 minutes' },
  { value: '*/30 * * * *', label: 'Every 30 minutes' },
  { value: '0 */1 * * *', label: 'Every hour' },
]

export function MonitorForm({ open, onOpenChange, onSubmit }: MonitorFormProps) {
  const [formData, setFormData] = useState({
    url: '',
    schedule: '*/30 * * * * *',
    timeout: 10000,
    retries: 3,
    retryDelay: 30000,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.url.trim()) {
      alert('Please enter a URL')
      return
    }

    try {
      setIsSubmitting(true)
      await onSubmit(formData)
      
      // Reset form and close dialog
      setFormData({
        url: '',
        schedule: '*/30 * * * * *',
        timeout: 10000,
        retries: 3,
        retryDelay: 30000,
      })
      onOpenChange(false)
    } catch (error) {
      console.error('Failed to add monitor:', error)
      alert('Failed to add monitor. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Monitor</DialogTitle>
          <DialogDescription>
            Add a new website or API endpoint to monitor.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="url">URL</Label>
            <Input
              id="url"
              placeholder="https://example.com"
              value={formData.url}
              onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="schedule">Check Frequency</Label>
            <Select
              value={formData.schedule}
              onValueChange={(value) => setFormData(prev => ({ ...prev, schedule: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {scheduleOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="timeout">Timeout (ms)</Label>
              <Input
                id="timeout"
                type="number"
                value={formData.timeout}
                onChange={(e) => setFormData(prev => ({ ...prev, timeout: parseInt(e.target.value) || 10000 }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="retries">Retries</Label>
              <Input
                id="retries"
                type="number"
                value={formData.retries}
                onChange={(e) => setFormData(prev => ({ ...prev, retries: parseInt(e.target.value) || 3 }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="retryDelay">Retry Delay (ms)</Label>
              <Input
                id="retryDelay"
                type="number"
                value={formData.retryDelay}
                onChange={(e) => setFormData(prev => ({ ...prev, retryDelay: parseInt(e.target.value) || 30000 }))}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Adding...' : 'Add Monitor'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
