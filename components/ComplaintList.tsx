import React, { useState } from "react";
import type { Complaint, ComplaintStatus, ComplaintCategory } from "@/lib/types";
import ComplaintBadge from "./ComplaintBadge";
import { SearchIcon, FilterIcon, ThumbsUpIcon, PinIcon, BuildingIcon, CalendarIcon } from "./Icons";

interface ComplaintListProps {
  complaints: Complaint[];
  onUpvote: (id: string) => void;
  onStatusChange: (id: string, newStatus: ComplaintStatus) => void;
}

export default function ComplaintList({ complaints, onUpvote, onStatusChange }: ComplaintListProps) {
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  console.log("ComplaintList received:", complaints.length, complaints.map(c => c.title));

  const filtered = complaints.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.ticketNumber.toLowerCase().includes(search.toLowerCase()) ||
      c.road.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = selectedStatus === "ALL" || c.status === selectedStatus;
    const matchesCategory = selectedCategory === "ALL" || c.category === selectedCategory;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const statusCounts = {
    ALL: complaints.length,
    "Pending Review": complaints.filter((c) => c.status === "Pending Review").length,
    "Under Investigation": complaints.filter((c) => c.status === "Under Investigation").length,
    "Action Scheduled": complaints.filter((c) => c.status === "Action Scheduled").length,
    Resolved: complaints.filter((c) => c.status === "Resolved").length,
  };

  return (
    <div className="space-y-4">
      {/* Search and Filters Bar */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        {/* Search Input */}
        <div className="relative w-full md:w-96">
          <SearchIcon className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by ticket #, road, or issue..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-slate-300 pl-9 pr-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-hidden focus:ring-1 focus:ring-blue-600"
          />
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <FilterIcon className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-700 bg-white focus:border-blue-600 focus:outline-hidden"
          >
            <option value="ALL">All Categories</option>
            <option value="Potholes & Road Damage">Potholes & Road Damage</option>
            <option value="Water Leakage & Pipeline Burst">Water Leakage & Pipeline Burst</option>
            <option value="Clogged Drain & Waterlogging">Clogged Drain & Waterlogging</option>
            <option value="Faulty Streetlights">Faulty Streetlights</option>
            <option value="Garbage & Debris on Road">Garbage & Debris on Road</option>
          </select>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {(["ALL", "Pending Review", "Under Investigation", "Action Scheduled", "Resolved"] as const).map(
          (status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                selectedStatus === status
                  ? "bg-slate-900 text-white shadow-2xs"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              <span>{status === "ALL" ? "All Tickets" : status}</span>
              <span
                className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                  selectedStatus === status ? "bg-slate-700 text-white" : "bg-slate-100 text-slate-600"
                }`}
              >
                {statusCounts[status]}
              </span>
            </button>
          )
        )}
      </div>

      {/* Complaints List / Table */}
      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <p className="text-sm font-semibold text-slate-600">No complaints found matching the criteria.</p>
          <p className="text-xs text-slate-400 mt-1">Try clearing your filters or search keywords.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border border-slate-200 bg-white p-4.5 shadow-2xs transition-all hover:shadow-sm hover:border-slate-300"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className="font-mono text-xs font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                      {item.ticketNumber}
                    </span>
                    <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {item.category}
                    </span>
                    <span className="text-xs font-medium text-slate-500">
                      {item.ward}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900">
                    {item.title}
                  </h3>

                  <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <PinIcon className="w-3.5 h-3.5 text-slate-400" />
                      <strong className="text-slate-700">{item.road}</strong>
                    </span>
                    <span className="flex items-center gap-1">
                      <BuildingIcon className="w-3.5 h-3.5 text-slate-400" />
                      <span>{item.assignedDepartment}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <CalendarIcon className="w-3.5 h-3.5 text-slate-400" />
                      <span>{item.createdAt}</span>
                    </span>
                    <span className="text-slate-400">
                      By: {item.reportedBy}
                    </span>
                  </div>
                </div>

                {/* Status Badge & Action Controls */}
                <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                  <ComplaintBadge status={item.status} />

                  <div className="flex items-center gap-2">
                    {/* Upvote Button */}
                    <button
                      onClick={() => onUpvote(item.id)}
                      title="Endorse this grievance as an affected citizen"
                      className="flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-colors cursor-pointer"
                    >
                      <ThumbsUpIcon className="w-3.5 h-3.5 text-blue-600" />
                      <span>{item.upvotes}</span>
                    </button>

                    {/* Quick Status Updater for Demo Testing */}
                    <select
                      value={item.status}
                      onChange={(e) => onStatusChange(item.id, e.target.value as ComplaintStatus)}
                      className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-medium text-slate-700 cursor-pointer focus:border-blue-600 focus:outline-hidden"
                    >
                      <option value="Pending Review">Pending Review</option>
                      <option value="Under Investigation">Under Investigation</option>
                      <option value="Action Scheduled">Action Scheduled</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
