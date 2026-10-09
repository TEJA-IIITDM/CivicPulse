import React from "react";
import type { NavTab } from "./Sidebar";
import { ConflictIcon, PlusIcon, PinIcon } from "./Icons";

interface HeaderProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  conflictCount: number;
}

const TAB_TITLES: Record<NavTab, { title: string; subtitle: string }> = {
  dashboard: {
    title: "Executive Infrastructure Dashboard",
    subtitle: "Real-time visibility into civic civil works, active conflicts, and citizen grievances.",
  },
  projects: {
    title: "Public Infrastructure Projects",
    subtitle: "Centralized catalog of road resurfacing, water mains, and stormwater drain works.",
  },
  conflicts: {
    title: "Inter-Agency Conflict Detection Engine",
    subtitle: "Automated schedule and right-of-way overlap warnings to stop repetitive road destruction.",
  },
  report: {
    title: "Lodge a Citizen Infrastructure Complaint",
    subtitle: "Report road damage, open trenches, leaks, or safety hazards directly to municipal authorities.",
  },
  tracking: {
    title: "Citizen Grievance Redressal Tracker",
    subtitle: "Monitor investigation status, departmental assignment, and resolution timelines.",
  },
  map: {
    title: "Municipal Corridor & GIS Location View",
    subtitle: "Schematic road corridor and ward-level work breakdown without external map credentials.",
  },
};

export default function Header({ activeTab, onTabChange, conflictCount }: HeaderProps) {
  const current = TAB_TITLES[activeTab];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-20 px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            {current.title}
          </h1>
          <span className="hidden sm:inline-block rounded bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
            CivicLens v1.0
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-0.5">
          {current.subtitle}
        </p>
      </div>

      <div className="flex items-center gap-3">
        {/* Active Conflict Warning Pill */}
        {conflictCount > 0 && (
          <button
            onClick={() => onTabChange("conflicts")}
            className="flex items-center gap-2 rounded-lg bg-rose-50 border border-rose-200 px-3 py-1.5 text-xs font-bold text-rose-800 hover:bg-rose-100 transition-colors cursor-pointer"
          >
            <ConflictIcon className="w-4 h-4 text-rose-600 animate-pulse" />
            <span>{conflictCount} Active Conflicts Detected</span>
          </button>
        )}

        {/* Municipality Selector Pill */}
        <div className="hidden lg:flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-700">
          <PinIcon className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-semibold">Metro Municipal Corp (North Zone)</span>
        </div>

        {/* Action Button */}
        {activeTab !== "report" && (
          <button
            onClick={() => onTabChange("report")}
            className="flex items-center gap-1.5 rounded-lg bg-blue-900 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-blue-800 transition-colors shadow-2xs cursor-pointer"
          >
            <PlusIcon className="w-3.5 h-3.5" />
            <span>Report Issue</span>
          </button>
        )}
      </div>
    </header>
  );
}
