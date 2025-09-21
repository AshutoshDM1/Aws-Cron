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
  const [timeRange, setTimeRange] = React.useState('Last 20 Minutes');

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
  let slotCount = 20; // Default: 20 minutes
  let intervalMinutes = 1;
  
  if (timeRange === 'Last 10 minutes') {
    slotCount = 10;
    intervalMinutes = 1;
  } else if (timeRange === 'Last 5 minutes') {
    slotCount = 5;
    intervalMinutes = 1;
  } else { // 'Last 20 Minutes' or default
    slotCount = 20;
    intervalMinutes = 1;
  }
  
  for (let i = slotCount - 1; i >= 0; i--) {
    const slot = new Date(now.getTime() - i * intervalMinutes * 60 * 1000);
    slots.push(formatDate(slot));
  }
  

  // For each monitor, map its history to the nearest slot
  const monitorSlotMaps: { [monitorId: string]: { [slot: string]: number | null } } = {};
  selectedMonitors.forEach((mon, index) => {
    
    const slotMap: { [slot: string]: number | null } = {};
    if (Array.isArray(mon.history) && mon.history.length > 0) {
      // Filter history entries to only include recent ones within our time range
      const cutoffTime = new Date(now);
      if (timeRange === 'Last 10 minutes') {
        cutoffTime.setMinutes(cutoffTime.getMinutes() - 10);
      } else if (timeRange === 'Last 5 minutes') {
        cutoffTime.setMinutes(cutoffTime.getMinutes() - 5);
      } else {
        cutoffTime.setMinutes(cutoffTime.getMinutes() - 20);
      }
      
      const recentHistory = mon.history.filter(entry => 
        new Date(entry.timestamp) >= cutoffTime
      );
      
      console.log(`Monitor ${mon.id} has ${recentHistory.length} recent entries out of ${mon.history.length} total`);
      
      recentHistory.forEach((entry) => {
        const entryDate = new Date(entry.timestamp);
        
        // Find the closest slot
        let closestSlot = slots[0];
        let minDiff = Math.abs(entryDate.getTime() - new Date(slots[0]).getTime());
        
        slots.forEach(slot => {
          const slotDate = new Date(slot);
          const diff = Math.abs(entryDate.getTime() - slotDate.getTime());
          if (diff < minDiff) {
            minDiff = diff;
            closestSlot = slot;
          }
        });
        
        // Only map if the difference is reasonable (within 3 minutes for better coverage)
        if (minDiff <= 3 * 60 * 1000) {
          slotMap[closestSlot] = entry.responseTimeMs;
        }
      });
    }
    monitorSlotMaps[mon.id] = slotMap;
  });

  // Build chartData: each slot is an object with date and responseTime for each monitor
  // e.g. { date: "...", [monitor1.id]: ..., [monitor2.id]: ... }
  const chartData = slots.map((slot) => {
    const dataPoint: { [key: string]: any } = { date: slot };
    selectedMonitors.forEach((mon) => {
      dataPoint[mon.id] = monitorSlotMaps[mon.id][slot] ?? null;
    });
    return dataPoint;
  });
  
  // Filter data based on selected time range
  let filteredData = chartData.filter((item) => {
    const date = new Date(item.date);
    const minutesAgo = new Date(now);
    
    if (timeRange === 'Last 10 minutes') {
      minutesAgo.setMinutes(minutesAgo.getMinutes() - 10);
    } else if (timeRange === 'Last 5 minutes') {
      minutesAgo.setMinutes(minutesAgo.getMinutes() - 5);
    } else { // 'Last 20 Minutes' or default
      minutesAgo.setMinutes(minutesAgo.getMinutes() - 20);
    }
    
    return date >= minutesAgo;
  });

  console.log(filteredData);

  return (
    <Card className="pt-0">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>{timeRange} Response Time</CardTitle>
          <CardDescription>Showing response time for the {timeRange.toLowerCase()}</CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex"
            aria-label="Select a value"
          >
            <SelectValue placeholder={timeRange} />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="Last 20 Minutes" className="rounded-lg">
              Last 20 Minutes
            </SelectItem>
            <SelectItem value="Last 10 minutes" className="rounded-lg"> 
              Last 10 minutes
            </SelectItem>
            <SelectItem value="Last 5 minutes" className="rounded-lg">
              Last 5 minutes
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
                        ? "#ef4444" // red-500
                        : index === 1
                        ? "#FBBC04" // yellow-400
                        : index === 2
                        ? "#3b82f6" // blue-500
                        : index === 3
                        ? "#22c55e" // green-500
                        : "#ec4899" // pink-500
                    }
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="100%"
                    stopColor={
                      index === 0
                        ? "#ef4444"
                        : index === 1
                        ? "#facc15"
                        : index === 2
                        ? "#3b82f6"
                        : index === 3
                        ? "#22c55e"
                        : "#ec4899"
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
                    const monitorIndex = selectedMonitors.findIndex(m => m.id === name);
                    const color = monitorIndex === 0
                      ? "#ef4444" // red-500
                      : monitorIndex === 1
                      ? "#FBBC04" // yellow-400
                      : monitorIndex === 2
                      ? "#3b82f6" // blue-500
                      : monitorIndex === 3
                      ? "#22c55e" // green-500
                      : "#ec4899"; // pink-500
                    
                    return [
                      <span key={name} style={{ color }}>{`${value}ms`}</span>,
                      <span key={`${name}-label`} style={{ color }}>
                        {(chartConfig[name as keyof typeof chartConfig]?.label as string) || name}
                      </span>
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
                    ? "#ef4444" // red-500
                    : index === 1
                    ? "#FBBC04" // yellow-400
                    : index === 2
                    ? "#3b82f6" // blue-500
                    : index === 3
                    ? "#22c55e" // green-500
                    : "#ec4899" // pink-500
                }
                strokeWidth={2}
                dot={false}
                connectNulls={false}
                fillOpacity={0.4}
              />
            ))}
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
