import React from "react";
import type { ComplaintStatus } from "@/lib/types";

interface ComplaintBadgeProps {
  status: ComplaintStatus;
}

const statusStyles: Record<ComplaintStatus, string> = {
  "Pending Review": "bg-amber-50 text-amber-700 border-amber-200",
  "Under Investigation": "bg-blue-50 text-blue-700 border-blue-200",
  "Action Scheduled": "bg-purple-50 text-purple-700 border-purple-200",
  Resolved: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

export default function ComplaintBadge({ status }: ComplaintBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium border ${statusStyles[status]}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}
