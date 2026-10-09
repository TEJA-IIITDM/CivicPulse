import React from "react";
import {
  DashboardIcon,
  ProjectIcon,
  ConflictIcon,
  ComplaintIcon,
  MapIcon,
  PlusIcon,
  BuildingIcon,
} from "./Icons";

export type NavTab = "dashboard" | "projects" | "conflicts" | "report" | "tracking" | "map";

interface SidebarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  conflictCount: number;
  complaintCount: number;
  projectCount: number;
}

export default function Sidebar({
  activeTab,
  onTabChange,
  conflictCount,
  complaintCount,
  projectCount,
}: SidebarProps) {
  const navItems = [
    {
      id: "dashboard" as NavTab,
      label: "Dashboard Overview",
      icon: DashboardIcon,
    },
    {
      id: "projects" as NavTab,
      label: "Infrastructure Projects",
      icon: ProjectIcon,
      badge: projectCount,
    },
    {
      id: "conflicts" as NavTab,
      label: "Conflict Detection",
      icon: ConflictIcon,
      badge: conflictCount,
      badgeColor: "bg-rose-500 text-white",
    },
    {
      id: "report" as NavTab,
      label: "Report a Grievance",
      icon: PlusIcon,
      highlight: true,
    },
    {
      id: "tracking" as NavTab,
      label: "Complaint Tracking",
      icon: ComplaintIcon,
      badge: complaintCount,
    },
    {
      id: "map" as NavTab,
      label: "Corridor & GIS Map",
      icon: MapIcon,
    },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 h-screen sticky top-0">
      <div>
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-blue-900 flex items-center justify-center text-white shadow-md shadow-blue-900/20">
              <BuildingIcon className="w-5 h-5 text-blue-200" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-black tracking-tight text-slate-900">
                  CivicLens
                </span>
                <span className="rounded bg-blue-100 px-1.5 py-0.2 text-[10px] font-bold text-blue-800">
                  MVP
                </span>
              </div>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                CivicTech Infrastructure Hub
              </p>
            </div>
          </div>
        </div>

        {/* Quick Report CTA */}
        <div className="p-4">
          <button
            onClick={() => onTabChange("report")}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-blue-900 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-blue-800 transition-colors cursor-pointer"
          >
            <PlusIcon className="w-4 h-4" />
            <span>File New Grievance</span>
          </button>
        </div>

        {/* Navigation List */}
        <nav className="px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? "bg-slate-900 text-white shadow-xs"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? "text-blue-300" : "text-slate-400"
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge !== undefined && (
                  <span
                    className={`rounded-full px-2 py-0.2 text-[10px] font-bold ${
                      item.badgeColor
                        ? item.badgeColor
                        : isActive
                        ? "bg-slate-700 text-slate-200"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        <div className="rounded-lg bg-white p-3 border border-slate-200/80 shadow-2xs">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-bold text-slate-800">
              Metro Works Cell
            </span>
          </div>
          <p className="mt-1 text-[10px] text-slate-500">
            Automated Conflict Detection Active. Road digging coordination online.
          </p>
        </div>
      </div>
    </aside>
  );
}
