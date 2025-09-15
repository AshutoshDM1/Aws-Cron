"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Eye,
  RefreshCw,
  MoreHorizontal,
  Clock,
} from "lucide-react";
import { Monitor } from "@/types/monitor";
import StatusIndicator from "./StatusIndicator";
import UptimeBar from "./UptimeBar";

interface MonitorRowProps {
  monitor: Monitor;
  onViewIncident?: (monitorId: string) => void;
  onRefresh?: (monitorId: string) => void;
  onEdit?: (monitorId: string) => void;
  onDelete?: (monitorId: string) => void;
}

const MonitorRow = ({
  monitor,
  onViewIncident,
  onRefresh,
  onEdit,
  onDelete,
}: MonitorRowProps) => {
  const formatDuration = (status: string, duration?: string) => {
    if (status === "up") {
      return `Up ${duration || "Unknown"}`;
    }
    return `Down ${duration || "Unknown"}`;
  };

  const getLastCheckTime = () => {
    if (!monitor.lastChecked) return "Unknown";
    
    const now = new Date();
    const lastCheck = new Date(monitor.lastChecked);
    const diffInMinutes = Math.floor((now.getTime() - lastCheck.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} min`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} hr`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''}`;
  };

  const getStatusText = () => {
    // This would typically come from monitor data
    if (monitor.status === "down") {
      return "DNS Resolving problem"; // or other error messages
    }
    return "";
  };

  return (
    <div className="flex items-center gap-4 p-4 border-b border-border/50 hover:bg-primary/80 bg-primary dark:bg-primary/70 transition-colors">
      {/* Status Indicator */}
      <StatusIndicator status={monitor.status} size="md" />

      {/* Monitor Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-medium text-white truncate">
            {monitor.name || monitor.url}
          </h3>
          <Badge className="text-xs bg-white text-black">
            HTTP
          </Badge>
        </div>
        
        <div className="text-sm text-white">
          {formatDuration(monitor.status, "3 day, 2 hr")} {/* This would come from monitor data */}
          {monitor.status === "down" && getStatusText() && (
            <span className="ml-2">| {getStatusText()}</span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {monitor.status === "down" && onViewIncident && (
          <Button
            size="sm"
            onClick={() => onViewIncident(monitor.id)}
            className="cursor-pointer bg-white text-black hover:bg-white/90"
          >
            <Eye className="w-4 h-4 mr-1" />
            View incident
          </Button>
        )}

        <div className="flex items-center gap-1 text-xs text-white">
          <RefreshCw className="w-3 h-3" />
          <span>{getLastCheckTime()}</span>
        </div>
      </div>

      {/* Uptime Bar */}
      <div className="w-32">
        <UptimeBar
          uptimePercent={monitor.uptimePercent24h || (monitor.status === "up" ? 100 : 0)}
          status={monitor.status}
        />
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
          <DropdownMenuItem onClick={() => onEdit?.(monitor.id)}>
            Edit Monitor
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => onDelete?.(monitor.id)}
          >
            Delete Monitor
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default MonitorRow;
