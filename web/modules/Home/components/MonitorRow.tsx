'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Eye, RefreshCw, MoreHorizontal, Clock } from 'lucide-react';
import { Monitor, URLStats } from '@/types/monitor';
import StatusIndicator from './StatusIndicator';
import UptimeBar from './UptimeBar';

interface MonitorRowProps {
  monitor: Monitor;
  UrlStats: URLStats[];
  onViewIncident?: (monitorId: string) => void;
  onRefresh?: (monitorId: string) => void;
  onEdit?: (monitorId: string) => void;
  onDelete?: (monitorId: string) => void;
}

const MonitorRow = ({
  monitor,
  UrlStats,
  onViewIncident,
  onRefresh,
  onEdit,
  onDelete,
}: MonitorRowProps) => {
  const urlStats = UrlStats.find((urlStat) => urlStat.URL === monitor.url);
  const formatDuration = (status: string, duration?: string) => {
    if (status === 'up') {
      return `Up ${duration || 'Unknown'}`;
    }
    return `Down ${duration || 'Unknown'}`;
  };

  const getStatusText = () => {
    // This would typically come from monitor data
    if (monitor.status === 'down') {
      return 'DNS Resolving problem'; // or other error messages
    }
    return '';
  };
  // Converts a number of minutes (can be fractional) into a human-readable time format
  const convertIntervalToTimeFormat = (minutes: number) => {
    if (typeof minutes !== 'number' || isNaN(minutes)) return 'Unknown';
    if (minutes < 1) {
      // Show seconds if less than 1 minute
      const seconds = Math.round(minutes * 60);
      return `${seconds}s`;
    }
    const days = Math.floor(minutes / (60 * 24));
    const hours = Math.floor((minutes % (60 * 24)) / 60);
    const mins = Math.floor(minutes % 60);
    let result = '';
    if (days > 0) result += `${days}d `;
    if (hours > 0) result += `${hours}h `;
    if (mins > 0) result += `${mins}m`;
    return result.trim() || '0m';
  };
  
  return (
    <div className="flex items-center gap-4 p-4 border-b border-border/50 hover:bg-primary/80 dark:hover:bg-primary/80 bg-primary dark:bg-primary/70 transition-colors">
      {/* Status Indicator */}
      <StatusIndicator status={monitor.status} size="md" />

      {/* Monitor Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-medium text-white truncate">{monitor.name || monitor.url}</h3>
          <Badge className="text-xs bg-white text-black">HTTP</Badge>
        </div>

        <div className="text-sm text-white line-clamp-3">
          {formatDuration(monitor.status, urlStats?.totalUptime || 'Unknown')}{' '}
          {/* This would come from monitor data */}
          {monitor.status === 'down' && getStatusText() && (
            <span className="ml-2 line-clamp-3">| {getStatusText()}</span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {monitor.status === 'down' && onViewIncident && (
          <Button
            size="sm"
            onClick={() => onViewIncident(monitor.id)}
            className="cursor-pointer bg-white text-black hover:bg-white/90"
          >
            <Eye className="w-4 h-4 mr-1" />
            View incident
          </Button>
        )}

        <div className="items-center gap-1 text-xs text-white hidden md:flex">
          <RefreshCw className="w-3 h-3" />
          <span>{convertIntervalToTimeFormat(urlStats?.Interval || 0)}</span>
        </div>
      </div>

      {/* Uptime Bar */}
      <div className="w-32 hidden md:block">
        <UptimeBar uptimePercent={Number(urlStats?.Uptime.split('%')[0])} status={monitor.status} />
      </div>

      {/* Options Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-white">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onRefresh?.(monitor.id)}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onEdit?.(monitor.id)}>Edit Monitor</DropdownMenuItem>
          <DropdownMenuItem onClick={() => onDelete?.(monitor.id)}>Delete Monitor</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default MonitorRow;
