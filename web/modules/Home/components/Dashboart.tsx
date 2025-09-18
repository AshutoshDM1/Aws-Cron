"use client";

import { useState, useMemo } from "react";
import { Monitor } from "@/types/monitor";
import DashboardHeader from "./DashboardHeader";
import MonitorTable from "./MonitorTable";
import { useMonitoredConfigs } from "@/hooks/getconfig";

// Mock data for demonstration
const mockMonitors: Monitor[] = [
  {
    id: "1",
    url: "codegen-aws.elitedev.tech",
    name: "codegen-aws.elitedev.tech",
    status: "down",
    lastChecked: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    uptimePercent24h: 0,
  },
  {
    id: "2",
    url: "codegen-server-m03i.onrender.com",
    name: "codegen-server-m03i.onrender.com",
    status: "down",
    lastChecked: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    uptimePercent24h: 0,
  },
  {
    id: "3",
    url: "restaurant-booking-backend-rb4t.onrender.com/",
    name: "restaurant-booking-backend-rb4t.onrender.com/",
    status: "down",
    lastChecked: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    uptimePercent24h: 0,
  },
  {
    id: "4",
    url: "backend-syndicate.onrender.com",
    name: "backend-syndicate.onrender.com",
    status: "up",
    lastChecked: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    uptimePercent24h: 100,
  },
  {
    id: "5",
    url: "backend-syndicate.onrender.com/get",
    name: "backend-syndicate.onrender.com",
    status: "up",
    lastChecked: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    uptimePercent24h: 100,
  },
];

const  Dashboard = () => {
  const configs = useMonitoredConfigs();
  console.log(configs);
  const [monitors, setMonitors] = useState<Monitor[]>(mockMonitors);
  const [selectedMonitors, setSelectedMonitors] = useState<string[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [sortBy, setSortBy] = useState("status-down");

  // Filter and sort monitors
  const filteredAndSortedMonitors = useMemo(() => {
    let filtered = monitors.filter((monitor) =>
      monitor.name?.toLowerCase().includes(searchValue.toLowerCase()) ||
      monitor.url.toLowerCase().includes(searchValue.toLowerCase())
    );

    // Sort monitors
    switch (sortBy) {
      case "status-down":
        return filtered.sort((a, b) => {
          if (a.status === "down" && b.status !== "down") return -1;
          if (a.status !== "down" && b.status === "down") return 1;
          return 0;
        });
      case "status-up":
        return filtered.sort((a, b) => {
          if (a.status === "up" && b.status !== "up") return -1;
          if (a.status !== "up" && b.status === "up") return 1;
          return 0;
        });
      case "name":
        return filtered.sort((a, b) => 
          (a.name || a.url).localeCompare(b.name || b.url)
        );
      case "name-desc":
        return filtered.sort((a, b) => 
          (b.name || b.url).localeCompare(a.name || a.url)
        );
      default:
        return filtered;
    }
  }, [monitors, searchValue, sortBy]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedMonitors(filteredAndSortedMonitors.map(m => m.id));
    } else {
      setSelectedMonitors([]);
    }
  };

  const handleNewMonitor = () => {
    // TODO: Implement new monitor creation
    console.log("Create new monitor");
  };

  const handleShowGroups = () => {
    // TODO: Implement group functionality
    console.log("Show groups");
  };

  const handleViewIncident = (monitorId: string) => {
    // TODO: Implement incident viewing
    console.log("View incident for monitor:", monitorId);
  };

  const handleRefresh = (monitorId: string) => {
    // TODO: Implement monitor refresh
    console.log("Refresh monitor:", monitorId);
  };

  const handleEdit = (monitorId: string) => {
    // TODO: Implement monitor editing
    console.log("Edit monitor:", monitorId);
  };

  const handleDelete = (monitorId: string) => {
    // TODO: Implement monitor deletion
    console.log("Delete monitor:", monitorId);
  };

  return (
    <div className="space-y-6">
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
    </div>
  );
};

export default Dashboard;
