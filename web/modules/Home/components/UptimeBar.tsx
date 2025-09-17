"use client";

import { cn } from "@/lib/utils";

interface UptimeBarProps {
  uptimePercent: number;
  status: "up" | "down" | "unknown";
  className?: string;
}

const UptimeBar = ({ uptimePercent, status, className }: UptimeBarProps) => {
  const getBarColor = () => {
    if (status === "down") {
      return "bg-red-500";
    }
    if (uptimePercent >= 99) {
      return "bg-green-500";
    }
    if (uptimePercent >= 95) {
      return "bg-yellow-500";
    }
    return "bg-red-500";
  };

  const barColor = getBarColor();
  const barWidth = Math.max(0, Math.min(100, uptimePercent));

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex-1 bg-white rounded-full h-2 overflow-hidden">
        <div
          className={cn(
            "h-full transition-all duration-300 ease-in-out",
            barColor
          )}
          style={{ width: `${barWidth}%` }}
        />
      </div>
      <span className="text-sm font-medium text-white min-w-[3rem] text-right">
        {uptimePercent.toFixed(0)}%
      </span>
    </div>
  );
};

export default UptimeBar;
