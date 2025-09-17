"use client";

import { ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatusIndicatorProps {
  status: "up" | "down" | "unknown";
  size?: "sm" | "md" | "lg";
}

const StatusIndicator = ({ status, size = "md" }: StatusIndicatorProps) => {
  const sizeClasses = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-6 h-6",
  };

  const iconSizeClasses = {
    sm: "w-2 h-2",
    md: "w-3 h-3",
    lg: "w-4 h-4",
  };

  const getStatusConfig = () => {
    switch (status) {
      case "up":
        return {
          bgColor: "bg-green-500",
          icon: ArrowUp,
          iconColor: "text-white",
        };
      case "down":
        return {
          bgColor: "bg-red-500",
          icon: ArrowDown,
          iconColor: "text-white",
        };
      case "unknown":
      default:
        return {
          bgColor: "bg-gray-500",
          icon: ArrowDown,
          iconColor: "text-white",
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center",
        config.bgColor,
        sizeClasses[size]
      )}
    >
      <Icon className={cn(config.iconColor, iconSizeClasses[size])} />
    </div>
  );
};

export default StatusIndicator;
