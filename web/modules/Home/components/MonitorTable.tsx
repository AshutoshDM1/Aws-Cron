"use client";

import { Monitor } from "@/types/monitor";
import MonitorRow from "./MonitorRow";

interface MonitorTableProps {
  monitors: Monitor[];
  selectedMonitors: string[];
  onMonitorSelect: (monitorId: string, selected: boolean) => void;
  onViewIncident?: (monitorId: string) => void;
  onRefresh?: (monitorId: string) => void;
  onEdit?: (monitorId: string) => void;
  onDelete?: (monitorId: string) => void;
}

const MonitorTable = ({
  monitors,
  selectedMonitors,
  onMonitorSelect,
  onViewIncident,
  onRefresh,
  onEdit,
  onDelete,
}: MonitorTableProps) => {
  if (monitors.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground mb-4">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
            <svg
              className="w-8 h-8 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium mb-2">No monitors found</h3>
          <p className="text-sm">
            Create your first monitor to start tracking your services.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden shadow-sm">
      <div className="divide-y divide-border">
        {monitors.map((monitor) => (
          <MonitorRow
            key={monitor.id}
            monitor={monitor}
            onViewIncident={onViewIncident}
            onRefresh={onRefresh}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default MonitorTable;
