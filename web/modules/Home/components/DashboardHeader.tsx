"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Search,
  Filter,
  ChevronDown,
  Lock,
  Plus,
} from "lucide-react";

interface DashboardHeaderProps {
  selectedCount: number;
  totalCount: number;
  onSelectAll: (checked: boolean) => void;
  onNewMonitor: () => void;
  onShowGroups: () => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
  statusFilter: "all" | "up" | "down" | "unknown";
  onStatusFilterChange: (filter: "all" | "up" | "down" | "unknown") => void;
  onSortChange: (sortBy: string) => void;
}

const DashboardHeader = ({
  selectedCount,
  totalCount,
  onSelectAll,
  onNewMonitor,
  onShowGroups,
  searchValue,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  onSortChange,
}: DashboardHeaderProps) => {
  return (
    <div className="space-y-4">
      {/* Title Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold text-foreground">
            Monitors.
          </h1>
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="bg-primary hover:bg-primary/80 text-white">
              <Plus className="w-4 h-4 mr-2" />
              New
              <ChevronDown className="w-4 h-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onNewMonitor}>
              Create New Monitor
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Controls Row */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
        {/* Selection Controls */}
        <div className="flex items-center gap-2">
          <Checkbox
            id="select-all"
            checked={selectedCount === totalCount && totalCount > 0}
            onCheckedChange={onSelectAll}
          />
          <label htmlFor="select-all" className="text-sm text-muted-foreground">
            {selectedCount}/{totalCount}
          </label>
          <Button
            variant="ghost"
            size="sm"
            onClick={onShowGroups}
            className="text-muted-foreground hover:text-foreground"
          >
            <Lock className="w-4 h-4 mr-1" />
            Show groups
          </Button>
        </div>

        {/* Search and Filter Controls */}
        <div className="flex items-center gap-2 md:ml-auto flex-wrap">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search by name or url"
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filter
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="space-y-1" align="end">
              <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">
                Status
              </div>
              <DropdownMenuItem 
                onClick={() => onStatusFilterChange("all")}
                className={statusFilter === "all" ? "bg-accent/50" : ""}
              >
                All
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onStatusFilterChange("up")}
                className={statusFilter === "up" ? "bg-accent/50" : ""}
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Up
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onStatusFilterChange("down")}
                className={statusFilter === "down" ? "bg-accent/50" : ""}
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  Down
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onStatusFilterChange("unknown")}
                className={statusFilter === "unknown" ? "bg-accent/50" : ""}
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                  Unknown
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="text-muted-foreground hover:text-foreground"
              >
                Down first
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onSortChange("status-down")}>
                Down first
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onSortChange("status-up")}>
                Up first
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onSortChange("name")}>
                Name A-Z
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onSortChange("name-desc")}>
                Name Z-A
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
