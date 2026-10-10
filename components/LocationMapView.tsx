import React, { useState } from "react";
import type { Project, ProjectConflict, Complaint, WardLocation } from "@/lib/types";
import { PinIcon, ConflictIcon, BuildingIcon, ComplaintIcon, ArrowRightIcon } from "./Icons";
import StatusBadge from "./StatusBadge";

interface LocationMapViewProps {
  projects: Project[];
  conflicts: ProjectConflict[];
  complaints: Complaint[];
  wards: WardLocation[];
  onSelectProject?: (project: Project) => void;
}

export default function LocationMapView({
  projects,
  conflicts,
  complaints,
  wards,
}: LocationMapViewProps) {
  const [selectedRoad, setSelectedRoad] = useState<string>("MG Road Corridor");
  const [filterType, setFilterType] = useState<"ALL" | "CONFLICTS" | "WORKS">("ALL");

  // Get distinct roads from projects
  const allRoads = Array.from(new Set(projects.map((p) => p.road)));

  // Selected road details
  const roadProjects = projects.filter((p) => p.road === selectedRoad);
  const roadConflicts = conflicts.filter((c) => c.road === selectedRoad);
  const roadComplaints = complaints.filter((c) => c.road === selectedRoad);

  return (
    <div className="space-y-6">
      {/* Top Banner explaining the location view */}
      <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-blue-900 p-2 text-white">
            <PinIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Municipal Corridor GIS & Conflict Zone Inspector
            </h3>
            <p className="text-xs text-slate-600">
              Interactive corridor grid visualization. No external API key required. Click on any road or ward to inspect infrastructure works and overlaps.
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-1.5 bg-white p-1 rounded-lg border border-slate-200 text-xs">
          <button
            onClick={() => setFilterType("ALL")}
            className={`px-3 py-1 rounded font-semibold transition-colors cursor-pointer ${
              filterType === "ALL" ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            All Corridors
          </button>
          <button
            onClick={() => setFilterType("CONFLICTS")}
            className={`px-3 py-1 rounded font-semibold transition-colors cursor-pointer flex items-center gap-1 ${
              filterType === "CONFLICTS" ? "bg-rose-700 text-white" : "text-rose-700 hover:bg-rose-50"
            }`}
          >
            <ConflictIcon className="w-3.5 h-3.5" />
            <span>Conflict Zones ({conflicts.length})</span>
          </button>
          <button
            onClick={() => setFilterType("WORKS")}
            className={`px-3 py-1 rounded font-semibold transition-colors cursor-pointer ${
              filterType === "WORKS" ? "bg-blue-700 text-white" : "text-blue-700 hover:bg-blue-50"
            }`}
          >
            Active Works Only
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Vector Map & Ward Grid (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-bold text-slate-900">
                City Arterial Road Corridors
              </h4>
              <span className="text-[11px] font-semibold text-slate-500">
                Click a corridor node to inspect
              </span>
            </div>

            {/* Vector Schematic Map View */}
            <div className="relative flex min-h-[340px] flex-col justify-between overflow-hidden rounded-xl border border-slate-700 bg-slate-800 p-4 shadow-inner">
              {/* Background Map Grid Pattern */}
              <div
                className="absolute inset-0 opacity-15"
                style={{
                  backgroundImage:
                    "radial-gradient(#94a3b8 1px, transparent 1px), radial-gradient(#94a3b8 1px, #0f172a 1px)",
                  backgroundSize: "24px 24px",
                  backgroundPosition: "0 0, 12px 12px",
                }}
              />

              {/* Schematic Road Lines (SVG) */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
                {/* Horizontal corridors */}
                <line x1="5%" y1="28%" x2="95%" y2="28%" stroke="#38bdf8" strokeWidth="3" strokeDasharray="6 4" />
                <line x1="10%" y1="65%" x2="90%" y2="65%" stroke="#38bdf8" strokeWidth="4" />
                {/* Vertical / diagonal crossings */}
                <line x1="30%" y1="10%" x2="30%" y2="90%" stroke="#818cf8" strokeWidth="3" />
                <line x1="70%" y1="10%" x2="70%" y2="90%" stroke="#818cf8" strokeWidth="3" />
                <line x1="15%" y1="20%" x2="85%" y2="80%" stroke="#fbbf24" strokeWidth="2" strokeDasharray="4 4" />
              </svg>

              {/* Road Corridor Nodes on Map */}
              <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-3 py-2">
                {allRoads.map((road) => {
                  const hasConflict = conflicts.some((c) => c.road === road);
                  const pCount = projects.filter((p) => p.road === road).length;
                  const cCount = complaints.filter((c) => c.road === road).length;
                  const isSelected = selectedRoad === road;

                  if (filterType === "CONFLICTS" && !hasConflict) return null;
                  if (filterType === "WORKS" && pCount === 0) return null;

                  return (
                    <button
                      key={road}
                      onClick={() => setSelectedRoad(road)}
                      className={`text-left p-3 rounded-lg border transition-all cursor-pointer backdrop-blur-md ${
                        isSelected
                          ? "bg-blue-950/90 border-blue-400 shadow-lg ring-1 ring-blue-400"
                          : hasConflict
                          ? "bg-rose-950/60 border-rose-500/70 hover:bg-rose-900/70"
                          : "bg-slate-800/70 border-slate-700 hover:bg-slate-700/80"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-1">
                        <span className="font-bold text-xs text-white truncate">
                          {road}
                        </span>
                        {hasConflict && (
                          <span className="flex-shrink-0 animate-pulse rounded bg-rose-500 px-1.5 py-0.2 text-[10px] font-bold text-white">
                            CONFLICT
                          </span>
                        )}
                      </div>

                      <div className="mt-2 flex items-center gap-2 text-[11px]">
                        <span className="rounded bg-blue-500/20 px-1.5 py-0.5 text-blue-300 font-semibold border border-blue-500/30">
                          {pCount} Works
                        </span>
                        {cCount > 0 && (
                          <span className="rounded bg-amber-500/20 px-1.5 py-0.5 text-amber-300 font-semibold border border-amber-500/30">
                            {cCount} Complaints
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Map Footer status */}
              <div className="relative z-10 mt-3 pt-2 border-t border-slate-700/60 flex items-center justify-between text-[11px] text-slate-300">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>Corridor data loaded</span>
                </span>
                <span className="text-slate-400">
                  Selected Corridor: <strong className="text-white">{selectedRoad}</strong>
                </span>
              </div>
            </div>

            {/* Ward Breakdown Cards */}
            <div className="mt-4 pt-4 border-t border-slate-100">
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Municipal Wards & Zones
              </h5>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {wards.map((ward) => (
                  <div
                    key={ward.id}
                    className="p-2.5 rounded-lg border border-slate-100 bg-slate-50/70 hover:bg-slate-100/70 transition-colors"
                  >
                    <span className="text-[11px] font-bold text-slate-800 block truncate">
                      {ward.name}
                    </span>
                    <div className="mt-1 flex items-center gap-2 text-[10px] text-slate-500 font-medium">
                      <span>{ward.activeProjects} Works</span>
                      {ward.conflictsCount > 0 && (
                        <span className="text-rose-600 font-bold">
                          ⚠️ {ward.conflictsCount} Conflict
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Detailed Corridor Inspector (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="pb-3 border-b border-slate-100">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                Corridor Inspector
              </span>
              <h3 className="mt-1.5 text-base font-bold text-slate-900">
                {selectedRoad}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Detailed view of concurrent department works and civic issues.
              </p>
            </div>

            {/* Conflict Warning if this road has one */}
            {roadConflicts.length > 0 && (
              <div className="mt-4 rounded-lg border border-rose-200 bg-rose-50 p-3.5">
                <div className="flex items-start gap-2">
                  <ConflictIcon className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-rose-900">
                      Active Conflict: {roadConflicts[0].conflictType}
                    </h4>
                    <p className="mt-1 text-[11px] text-rose-700 leading-relaxed">
                      {roadConflicts[0].description}
                    </p>
                    <p className="mt-1.5 text-[11px] font-bold text-rose-900">
                      Mitigation: {roadConflicts[0].suggestedAction}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Scheduled Works on this corridor */}
            <div className="mt-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center justify-between">
                <span>Infrastructure Projects ({roadProjects.length})</span>
              </h4>

              {roadProjects.length === 0 ? (
                <p className="text-xs text-slate-400 italic py-2">
                  No active projects currently logged on this road.
                </p>
              ) : (
                <div className="space-y-2.5">
                  {roadProjects.map((p) => (
                    <div
                      key={p.id}
                      className="p-3 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-semibold text-slate-500">
                            {p.category}
                          </span>
                          <h5 className="text-xs font-bold text-slate-900 leading-snug">
                            {p.name}
                          </h5>
                        </div>
                        <StatusBadge status={p.status} />
                      </div>

                      <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
                        <span className="flex items-center gap-1 truncate max-w-[170px]" title={p.department}>
                          <BuildingIcon className="w-3 h-3 text-slate-400 flex-shrink-0" />
                          <span className="truncate">{p.department}</span>
                        </span>
                        <span className="font-semibold text-slate-800">{p.progress}%</span>
                      </div>

                      <div className="mt-1 h-1.5 rounded-full bg-slate-200 overflow-hidden">
                        <div
                          className="h-full bg-blue-600 rounded-full"
                          style={{ width: `${p.progress}%` }}
                        />
                      </div>

                      <p className="mt-1.5 text-[10px] text-slate-500">
                        {p.startDate} &rarr; {p.deadline}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Citizen Complaints on this corridor */}
            <div className="mt-5 pt-4 border-t border-slate-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Citizen Complaints ({roadComplaints.length})
              </h4>

              {roadComplaints.length === 0 ? (
                <p className="text-xs text-slate-400 italic py-1">
                  No grievances reported on this corridor.
                </p>
              ) : (
                <div className="space-y-2">
                  {roadComplaints.map((c) => (
                    <div
                      key={c.id}
                      className="p-2.5 rounded-lg border border-slate-100 bg-white text-xs shadow-2xs"
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-bold text-slate-800 truncate">
                          {c.title}
                        </span>
                        <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 font-semibold flex-shrink-0">
                          {c.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                        {c.description}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
