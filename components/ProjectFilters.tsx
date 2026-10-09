
"use client";

import type { ProjectStatus } from "@/lib/types";

type ProjectFiltersProps = {
  status: string;
  search: string;
  onStatusChange: (status: string) => void;
  onSearchChange: (search: string) => void;
};

const statuses: ProjectStatus[] = [
  "Planned",
  "In Progress",
  "Delayed",
  "Completed",
];

export default function ProjectFilters({
  status,
  search,
  onStatusChange,
  onSearchChange,
}: ProjectFiltersProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <input
        type="search"
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Search projects or roads..."
        aria-label="Search projects"
        className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
      />

      <select
        value={status}
        onChange={(event) => onStatusChange(event.target.value)}
        aria-label="Filter by project status"
        className="rounded-lg border border-gray-300 bg-white px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="All">All statuses</option>
        {statuses.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
    </div>
  );
}
