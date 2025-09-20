"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

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
    return "bg-white";
  };
  
  const barColor = getBarColor();

  // Ensure we show at least a small bar when status is down, even if uptime is 0%
  const barWidth = status === "down" && uptimePercent === 0 
    ? 100 // Show full width red bar when completely down
    : Math.max(0, Math.min(100, uptimePercent));

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex-1 bg-gray-50 rounded-full h-2 overflow-hidden">
        <motion.div
          className={cn("h-full", barColor)}
          initial={{ width: 0 }}
          animate={{ width: `${barWidth}%` }}
          transition={{
            duration: 0.8,
            ease: "easeOut",
            delay: 0.1
          }}
        />
      </div>
      <motion.span 
        className="text-sm font-medium text-white min-w-[3rem] text-right"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        {uptimePercent.toFixed(0)}%
      </motion.span>
    </div>
  );
};

export default UptimeBar;
