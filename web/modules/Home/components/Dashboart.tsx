"use client";

import { useState, useMemo, useEffect } from "react";
import { Monitor } from "@/types/monitor";
import DashboardHeader from "./DashboardHeader";
import MonitorTable from "./MonitorTable";
import { MonitorForm } from "@/components/monitor-form";
import { useMonitors } from "@/hooks/use-monitors";

const Dashboard = () => {
  const { 
    monitors: fetchedMonitors, 
    loading, 
    error, 
    refetch, 
    addMonitor, 
    updateMonitor, 
    deleteMonitor, 
    pingMonitor 
  } = useMonitors();
  
  const [selectedMonitors, setSelectedMonitors] = useState<string[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [sortBy, setSortBy] = useState("status-down");
  const [showMonitorForm, setShowMonitorForm] = useState(false);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 10000);

    return () => clearInterval(interval);
  }, [refetch]);

  // Filter and sort monitors
  const filteredAndSortedMonitors = useMemo(() => {
    let filtered = fetchedMonitors.filter((monitor: Monitor) =>
      monitor.name?.toLowerCase().includes(searchValue.toLowerCase()) ||
      monitor.url.toLowerCase().includes(searchValue.toLowerCase())
    );

    // Sort monitors
    switch (sortBy) {
      case "status-down":
        return filtered.sort((a: Monitor, b: Monitor) => {
          if (a.status === "down" && b.status !== "down") return -1;
          if (a.status !== "down" && b.status === "down") return 1;
          return 0;
        });
      case "status-up":
        return filtered.sort((a: Monitor, b: Monitor) => {
          if (a.status === "up" && b.status !== "up") return -1;
          if (a.status !== "up" && b.status === "up") return 1;
          return 0;
        });
      case "name":
        return filtered.sort((a: Monitor, b: Monitor) => 
          (a.name || a.url).localeCompare(b.name || b.url)
        );
      case "name-desc":
        return filtered.sort((a: Monitor, b: Monitor) => 
          (b.name || b.url).localeCompare(a.name || a.url)
        );
      default:
        return filtered;
    }
  }, [fetchedMonitors, searchValue, sortBy]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedMonitors(filteredAndSortedMonitors.map((m: Monitor) => m.id));
    } else {
      setSelectedMonitors([]);
    }
  };

  const handleNewMonitor = () => {
    setShowMonitorForm(true);
  };

  const handleAddMonitor = async (monitorData: {
    url: string
    schedule: string
    timeout?: number
    retries?: number
    retryDelay?: number
  }) => {
    await addMonitor(monitorData);
  };

  const handleShowGroups = () => {
    // TODO: Implement group functionality
    console.log("Show groups");
  };

  const handleViewIncident = (monitorId: string) => {
    // TODO: Implement incident viewing
    console.log("View incident for monitor:", monitorId);
  };

  const handleRefresh = async (monitorId: string) => {
    try {
      const monitor = fetchedMonitors.find((m: Monitor) => m.id === monitorId);
      if (monitor) {
        await pingMonitor(monitor.url);
        console.log("Monitor refreshed:", monitorId);
      }
    } catch (error) {
      console.error("Failed to refresh monitor:", error);
    }
  };

  const handleEdit = (monitorId: string) => {
    // TODO: Implement monitor editing dialog
    console.log("Edit monitor:", monitorId);
  };

  const handleDelete = async (monitorId: string) => {
    try {
      const monitor = fetchedMonitors.find((m: Monitor) => m.id === monitorId);
      if (monitor && confirm(`Are you sure you want to delete monitor for ${monitor.url}?`)) {
        await deleteMonitor(monitor.url);
        console.log("Monitor deleted:", monitorId);
      }
    } catch (error) {
      console.error("Failed to delete monitor:", error);
    }
  };

  if (loading && fetchedMonitors.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-muted-foreground">Loading monitors...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && fetchedMonitors.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <p className="text-red-500 mb-2">Error loading monitors</p>
            <p className="text-muted-foreground text-sm mb-4">{error}</p>
            <button 
              onClick={refetch}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
          <span className="block sm:inline">{error}</span>
          <button 
            onClick={() => window.location.reload()}
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
          >
            <span className="sr-only">Dismiss</span>
            ×
          </button>
        </div>
      )}
      
      <DashboardHeader
        selectedCount={selectedMonitors.length}
        totalCount={filteredAndSortedMonitors.length}
        onSelectAll={handleSelectAll}
        onNewMonitor={handleNewMonitor}
        onShowGroups={handleShowGroups}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        onFilter={() => console.log("Filter")}
        onSortChange={setSortBy}
      />
      
      <MonitorTable
        monitors={filteredAndSortedMonitors}
        selectedMonitors={selectedMonitors}
        onMonitorSelect={(monitorId, selected) => {
          if (selected) {
            setSelectedMonitors(prev => [...prev, monitorId]);
          } else {
            setSelectedMonitors(prev => prev.filter(id => id !== monitorId));
          }
        }}
        onViewIncident={handleViewIncident}
        onRefresh={handleRefresh}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      
      <MonitorForm
        open={showMonitorForm}
        onOpenChange={setShowMonitorForm}
        onSubmit={handleAddMonitor}
      />
    </div>
  );
};

export default Dashboard;
