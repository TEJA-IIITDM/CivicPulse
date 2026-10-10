import React from "react";
import type { Project } from "@/lib/types";
import StatusBadge from "./StatusBadge";
import { CalendarIcon, PinIcon, BuildingIcon, ConflictIcon } from "./Icons";

type ProjectCardProps = {
  project: Project;
  hasConflict?: boolean;
  onConflictClick?: () => void;
};

export default function ProjectCard({ project, hasConflict = false, onConflictClick }: ProjectCardProps) {
  return (
    <article className="relative flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md hover:border-slate-300">
      {hasConflict && (
        <div className="mb-3 flex items-center justify-between rounded-lg bg-amber-50 px-3 py-1.5 border border-amber-200">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-900">
            <ConflictIcon className="w-4 h-4 text-amber-600" />
            <span>Schedule Conflict on {project.road}</span>
          </div>
          {onConflictClick && (
            <button
              onClick={onConflictClick}
              className="text-xs font-semibold text-blue-700 hover:text-blue-900 hover:underline cursor-pointer"
            >
              View Overlap &rarr;
            </button>
          )}
        </div>
      )}

      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="rounded bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700">
                {project.category}
              </span>
              {project.ward && (
                <span className="rounded bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-700 border border-blue-100">
                  {project.ward}
                </span>
              )}
            </div>
            <h3 className="text-base font-semibold leading-snug text-slate-900">
              {project.name}
            </h3>
            <p className="mt-1 flex items-center gap-1 text-xs text-slate-500 font-medium">
              <PinIcon className="w-3.5 h-3.5 text-slate-400" />
              <span>{project.road}</span>
            </p>
          </div>
          <StatusBadge status={project.status} />
        </div>

        <p className="mt-3 text-xs text-slate-600 line-clamp-2 leading-relaxed">
          {project.description}
        </p>

        <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1 font-medium text-slate-700 truncate max-w-[200px]" title={project.department}>
            <BuildingIcon className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className="truncate">{project.department}</span>
          </span>
          <span className="font-semibold text-slate-900">{project.progress}%</span>
        </div>

        <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              project.status === "Delayed"
                ? "bg-rose-500"
                : project.status === "Completed"
                ? "bg-emerald-500"
                : "bg-blue-600"
            }`}
            style={{
              width: `${Math.min(100, Math.max(0, project.progress))}%`,
            }}
          />
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span className="flex items-center gap-1">
          <CalendarIcon className="w-3.5 h-3.5 text-slate-400" />
          <span>{project.startDate} to {project.deadline}</span>
        </span>
        {project.budget && (
          <span className="font-semibold text-slate-700">
            {project.budget}
          </span>
        )}
      </div>
    </article>
  );
}