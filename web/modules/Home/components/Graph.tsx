'use client';

import * as React from 'react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useIsMobile } from '@/hooks/use-mobile';

export const description = 'Response Time Monitoring Chart';

interface Monitor {
  id: string;
  url: string;
  name: string;
  status: string;
  lastChecked: string;
  responseTimeMs: number;
  uptimePercent24h: number;
  history: Array<{
    timestamp: string;
    status: string;
    responseTimeMs: number;
  }>;
}

export function ChartAreaInteractive({ monitor }: { monitor: Monitor[] }) {
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = React.useState('Last 12 Hours');

  React.useEffect(() => {
    const defaultTimeRange = isMobile ? 'Last 1 Hour' : 'Last 12 Hours';
    setTimeRange(defaultTimeRange);
  }, [isMobile]);

  // Only use up to 5 monitors
  const selectedMonitors = Array.isArray(monitor) ? monitor.slice(0, 5) : [];

  // Create dynamic chart config based on monitors
  const chartConfig = selectedMonitors.reduce((config, monitor, index) => {
    config[monitor.id] = {
      label: monitor.name || `Monitor ${monitor.id}`,
      color: `hsl(var(--chart-${(index % 5) + 1}))`,
    };
    return config;
  }, {} as ChartConfig);

  // Helper to format date as "YYYY-MM-DD HH:mm"
  const pad = (n: number) => n.toString().padStart(2, '0');
  const formatDate = (date: Date) =>
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;

  // Generate slots based on selected time range
  const now = new Date();
  const slots: string[] = [];

  // Determine slot count and interval based on time range
  let slotCount = 144; // Default: 12 hours (144 slots of 5 minutes each)
  let intervalMinutes = 5;

  if (timeRange === 'Last 6 Hours') {
    slotCount = 72; // 6 hours * 12 slots per hour
    intervalMinutes = 5;
  } else if (timeRange === 'Last 3 Hours') {
    slotCount = 36; // 3 hours * 12 slots per hour
    intervalMinutes = 5;
  } else if (timeRange === 'Last 1 Hour') {
    slotCount = 12; // 1 hour * 12 slots per hour
    intervalMinutes = 5;
  } else {
    // 'Last 12 Hours' or default
    slotCount = 144;
    intervalMinutes = 5;
  }

  for (let i = slotCount - 1; i >= 0; i--) {
    const slot = new Date(now.getTime() - i * intervalMinutes * 60 * 1000);
    slots.push(formatDate(slot));
  }

  // Use the backend's pre-processed history data directly
  const chartData: { [key: string]: any }[] = [];

  // Collect all unique timestamps from all monitors' history
  const allTimeSlots = new Set<string>();

  selectedMonitors.forEach((mon) => {
    if (Array.isArray(mon.history) && mon.history.length > 0) {
      // Filter history based on selected time range
      const cutoffTime = new Date(now);
      if (timeRange === 'Last 6 Hours') {
        cutoffTime.setHours(cutoffTime.getHours() - 6);
      } else if (timeRange === 'Last 3 Hours') {
        cutoffTime.setHours(cutoffTime.getHours() - 3);
      } else if (timeRange === 'Last 1 Hour') {
        cutoffTime.setHours(cutoffTime.getHours() - 1);
      } else {
        // 'Last 12 Hours' or default
        cutoffTime.setHours(cutoffTime.getHours() - 12);
      }

      mon.history
        .filter((entry) => new Date(entry.timestamp) >= cutoffTime)
        .forEach((entry) => {
          allTimeSlots.add(entry.timestamp);
        });
    }
  });

  // Create chart data for each time slot
  const sortedTimeSlots = Array.from(allTimeSlots).sort();

  sortedTimeSlots.forEach((timeSlot) => {
    const dataPoint: { [key: string]: any } = { date: timeSlot };

    selectedMonitors.forEach((mon) => {
      let responseTime = null;

      if (Array.isArray(mon.history) && mon.history.length > 0) {
        // Find exact match first, then closest
        const exactMatch = mon.history.find((entry) => entry.timestamp === timeSlot);

        if (exactMatch) {
          responseTime = (exactMatch as any).responseTimeMs;
        } else {
          // Find the closest entry within reasonable time
          let closestEntry = null;
          let minTimeDiff = Infinity;

          mon.history.forEach((entry) => {
            const entryTime = new Date(entry.timestamp);
            const slotTime = new Date(timeSlot);
            const timeDiff = Math.abs(entryTime.getTime() - slotTime.getTime());

            // Accept entries within 2.5 minutes of the slot (half of 5-minute interval)
            if (timeDiff <= 2.5 * 60 * 1000 && timeDiff < minTimeDiff) {
              minTimeDiff = timeDiff;
              closestEntry = entry;
            }
          });

          if (closestEntry) {
            responseTime = (closestEntry as any).responseTimeMs;
          }
        }
      }

      dataPoint[mon.id] = responseTime;
    });

    chartData.push(dataPoint);
  });

  // If we have no data from history, create empty slots
  if (chartData.length === 0) {
    for (let i = slotCount - 1; i >= 0; i--) {
      const slot = new Date(now.getTime() - i * intervalMinutes * 60 * 1000);
      const dataPoint: { [key: string]: any } = { date: formatDate(slot) };
      selectedMonitors.forEach((mon) => {
        dataPoint[mon.id] = null;
      });
      chartData.push(dataPoint);
    }
  }

  // Sort by date to ensure proper order and format dates consistently
  const filteredData = chartData
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((item) => ({
      ...item,
      date: formatDate(new Date(item.date)),
    }));

  return (
    <Card className="pt-0">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 flex-col sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>{timeRange} Response Time</CardTitle>
          <CardDescription>Showing response time for the {timeRange.toLowerCase()}</CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[160px] rounded-lg sm:ml-auto" aria-label="Select a value">
            <SelectValue placeholder={timeRange} />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="Last 12 Hours" className="rounded-lg">
              Last 12 Hours
            </SelectItem>
            <SelectItem value="Last 6 Hours" className="rounded-lg">
              Last 6 Hours
            </SelectItem>
            <SelectItem value="Last 3 Hours" className="rounded-lg">
              Last 3 Hours
            </SelectItem>
            <SelectItem value="Last 1 Hour" className="rounded-lg">
              Last 1 Hour
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          <AreaChart data={filteredData}>
            <defs>
              {selectedMonitors.map((monitor, index) => (
                <linearGradient
                  key={monitor.id}
                  id={`fill${monitor.id}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor={
                      index === 0
                        ? '#ef4444' // red-500
                        : index === 1
                          ? '#FBBC04' // yellow-400
                          : index === 2
                            ? '#3b82f6' // blue-500
                            : index === 3
                              ? '#22c55e' // green-500
                              : '#ec4899' // pink-500
                    }
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="100%"
                    stopColor={
                      index === 0
                        ? '#ef4444'
                        : index === 1
                          ? '#facc15'
                          : index === 2
                            ? '#3b82f6'
                            : index === 3
                              ? '#22c55e'
                              : '#ec4899'
                    }
                    stopOpacity={0.1}
                  />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid vertical={false} />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `${value}ms`}
            />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                // For longer time ranges, show date + time
                if (timeRange === 'Last 12 Hours' || timeRange === 'Last 6 Hours') {
                  return date.toLocaleString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  });
                }
                // For shorter ranges, just show time
                return date.toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    });
                  }}
                  indicator="dot"
                  formatter={(value, name) => {
                    const monitorIndex = selectedMonitors.findIndex((m) => m.id === name);
                    const color =
                      monitorIndex === 0
                        ? '#ef4444' // red-500
                        : monitorIndex === 1
                          ? '#FBBC04' // yellow-400
                          : monitorIndex === 2
                            ? '#3b82f6' // blue-500
                            : monitorIndex === 3
                              ? '#22c55e' // green-500
                              : '#ec4899'; // pink-500

                    return [
                      <span key={name} style={{ color }}>{`${value}ms`}</span>,
                      <span key={`${name}-label`} style={{ color }}>
                        {(chartConfig[name as keyof typeof chartConfig]?.label as string) || name}
                      </span>,
                    ];
                  }}
                />
              }
            />
            {selectedMonitors.map((monitor, index) => (
              <Area
                key={monitor.id}
                dataKey={monitor.id}
                type="monotone"
                fill={`url(#fill${monitor.id})`}
                stroke={
                  index === 0
                    ? '#ef4444' // red-500
                    : index === 1
                      ? '#FBBC04' // yellow-400
                      : index === 2
                        ? '#3b82f6' // blue-500
                        : index === 3
                          ? '#22c55e' // green-500
                          : '#ec4899' // pink-500
                }
                strokeWidth={2}
                dot={false}
                connectNulls={false}
                fillOpacity={0.4}
              />
            ))}
            <ChartLegend
              className="flex-col gap-0 md:gap-4 md:flex-row"
              content={<ChartLegendContent />}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
