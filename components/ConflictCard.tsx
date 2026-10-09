import React, { useState } from "react";
import type { ProjectConflict } from "@/lib/types";
import { ConflictIcon, CalendarIcon, BuildingIcon, CheckCircleIcon, ShieldAlertIcon } from "./Icons";

interface ConflictCardProps {
  conflict: ProjectConflict;
}

export default function ConflictCard({ conflict }: ConflictCardProps) {
  const [acknowledged, setAcknowledged] = useState(false);

  // Calculate days of overlap roughly
  const start = new Date(conflict.overlapStart).getTime();
  const end = new Date(conflict.overlapEnd).getTime();
  const diffDays = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));

  return (
    <div className={`rounded-xl border p-5 shadow-sm transition-all ${
      acknowledged 
        ? "border-emerald-200 bg-emerald-50/30" 
        : conflict.severity === "High"
        ? "border-rose-200 bg-white"
        : "border-amber-200 bg-white"
    }`}>
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-lg ${
            conflict.severity === "High" ? "bg-rose-100 text-rose-700" : "bg-amber-100 text-amber-700"
          }`}>
            <ConflictIcon className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Schedule Conflict Detected
            </span>
            <h3 className="text-base font-bold text-slate-900">
              {conflict.road}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
            {conflict.ward}
          </span>
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold border ${
            conflict.severity === "High"
              ? "bg-rose-50 text-rose-700 border-rose-200"
              : "bg-amber-50 text-amber-700 border-amber-200"
          }`}>
            {conflict.severity} Severity Risk
          </span>
        </div>
      </div>

      {/* Conflict Reason Description */}
      <div className="mt-4 p-3.5 rounded-lg bg-slate-50 border border-slate-200/80">
        <div className="flex items-start gap-2">
          <ShieldAlertIcon className="w-5 h-5 text-rose-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-bold text-slate-900">
              {conflict.conflictType}
            </h4>
            <p className="mt-1 text-xs text-slate-600 leading-relaxed">
              {conflict.description}
            </p>
          </div>
        </div>
      </div>

      {/* Side-by-Side Clashing Projects */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Project 1 */}
        <div className="p-3.5 rounded-lg border border-slate-200 bg-white shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
            Project A (Agency 1)
          </span>
          <h5 className="mt-1.5 text-sm font-bold text-slate-900 leading-tight">
            {conflict.project1.name}
          </h5>
          <div className="mt-2 space-y-1 text-xs text-slate-600">
            <p className="flex items-center gap-1.5">
              <BuildingIcon className="w-3.5 h-3.5 text-slate-400" />
              <span>{conflict.project1.department}</span>
            </p>
            <p className="flex items-center gap-1.5">
              <CalendarIcon className="w-3.5 h-3.5 text-slate-400" />
              <span>{conflict.project1.startDate} to {conflict.project1.deadline}</span>
            </p>
          </div>
        </div>

        {/* Project 2 */}
        <div className="p-3.5 rounded-lg border border-slate-200 bg-white shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
            Project B (Agency 2)
          </span>
          <h5 className="mt-1.5 text-sm font-bold text-slate-900 leading-tight">
            {conflict.project2.name}
          </h5>
          <div className="mt-2 space-y-1 text-xs text-slate-600">
            <p className="flex items-center gap-1.5">
              <BuildingIcon className="w-3.5 h-3.5 text-slate-400" />
              <span>{conflict.project2.department}</span>
            </p>
            <p className="flex items-center gap-1.5">
              <CalendarIcon className="w-3.5 h-3.5 text-slate-400" />
              <span>{conflict.project2.startDate} to {conflict.project2.deadline}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Overlap timeline bar */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-md bg-amber-50/70 border border-amber-200/60 text-xs">
        <span className="font-semibold text-amber-900 flex items-center gap-1.5">
          <CalendarIcon className="w-4 h-4 text-amber-600" />
          <span>Simultaneous Work Window: <strong>{conflict.overlapStart}</strong> to <strong>{conflict.overlapEnd}</strong></span>
        </span>
        <span className="rounded bg-amber-200 px-2 py-0.5 font-bold text-amber-900">
          {diffDays} Days Overlap
        </span>
      </div>

      {/* Suggested Resolution & Action Button */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
        <div className="flex-1 min-w-[240px]">
          <span className="text-[11px] font-bold uppercase text-slate-400">
            Suggested Municipal Mitigation:
          </span>
          <p className="text-xs font-medium text-slate-700 mt-0.5">
            {conflict.suggestedAction}
          </p>
        </div>

        <button
          onClick={() => setAcknowledged(!acknowledged)}
          className={`flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors cursor-pointer ${
            acknowledged
              ? "bg-emerald-600 text-white hover:bg-emerald-700"
              : "bg-slate-900 text-white hover:bg-slate-800"
          }`}
        >
          <CheckCircleIcon className="w-4 h-4" />
          <span>{acknowledged ? "Coordination Scheduled" : "Issue Coordination Notice"}</span>
        </button>
      </div>
    </div>
  );
}
