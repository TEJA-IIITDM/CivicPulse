import React, { useState } from "react";
import type { Complaint, ComplaintCategory } from "@/lib/types";
import { PlusIcon, CheckCircleIcon, PinIcon } from "./Icons";

interface ComplaintFormProps {
  onComplaintSubmitted: (newComplaint: Complaint) => void;
  availableRoads?: string[];
}

const CATEGORIES: ComplaintCategory[] = [
  "Potholes & Road Damage",
  "Water Leakage & Pipeline Burst",
  "Clogged Drain & Waterlogging",
  "Faulty Streetlights",
  "Garbage & Debris on Road",
  "Unmarked Road Excavation",
];

const DEFAULT_ROADS = [
  "MG Road Corridor",
  "Outer Ring Road",
  "Station Road",
  "Lake View Avenue",
  "Anna Salai Arterial",
  "Brigade Cross",
  "Residency Avenue",
];

export default function ComplaintForm({ onComplaintSubmitted, availableRoads = DEFAULT_ROADS }: ComplaintFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [road, setRoad] = useState(availableRoads[0] || "MG Road Corridor");
  const [customRoad, setCustomRoad] = useState("");
  const [category, setCategory] = useState<ComplaintCategory>(CATEGORIES[0]);
  const [ward, setWard] = useState("Ward 14 - Central Metro");
  const [reportedBy, setReportedBy] = useState("");
  const [hasPhoto, setHasPhoto] = useState(false);

  const [submittedTicket, setSubmittedTicket] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError("Please enter a title for the grievance.");
      return;
    }
    if (!description.trim()) {
      setError("Please describe the infrastructure issue in detail.");
      return;
    }

    const finalRoad = road === "OTHER" ? customRoad.trim() : road;
    if (!finalRoad) {
      setError("Please specify the road or landmark location.");
      return;
    }

    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const ticketNumber = `CVL-2026-${randomDigits}`;

    // Determine assigned department based on category
    let assignedDepartment = "Public Works Department (PWD)";
    if (category.includes("Water")) {
      assignedDepartment = "Water Supply & Sewerage Board (BWSSB)";
    } else if (category.includes("Drain")) {
      assignedDepartment = "Stormwater Drainage Dept";
    } else if (category.includes("Streetlight")) {
      assignedDepartment = "Municipal Electricity Cell (TNEB)";
    } else if (category.includes("Garbage")) {
      assignedDepartment = "Solid Waste Management";
    }

    const newComplaint: Complaint = {
      id: `comp-${Date.now()}`,
      ticketNumber,
      title: title.trim(),
      description: description.trim(),
      road: finalRoad,
      ward,
      category,
      status: "Pending Review",
      createdAt: new Date().toISOString().split("T")[0],
      reportedBy: reportedBy.trim() ? `${reportedBy.trim()} (Citizen)` : "Anonymous Resident",
      upvotes: 1,
      assignedDepartment,
    };

    onComplaintSubmitted(newComplaint);
    setSubmittedTicket(ticketNumber);
    setError(null);

    // Reset form fields
    setTitle("");
    setDescription("");
    setReportedBy("");
    setCustomRoad("");
    setHasPhoto(false);
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 border border-blue-100">
          <PinIcon className="w-3.5 h-3.5" />
          <span>Citizen Grievance Portal</span>
        </div>
        <h2 className="mt-2 text-xl font-bold text-slate-900">
          Report a Public Infrastructure Issue
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Log damaged roads, open trench hazards, leaking pipelines, or broken lighting. Our engine cross-references active project schedules to prevent repeated road digging.
        </p>
      </div>

      {submittedTicket && (
        <div className="mb-6 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
          <div className="flex items-start gap-3">
            <CheckCircleIcon className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-emerald-900">
                Grievance Logged Successfully!
              </h3>
              <p className="mt-0.5 text-xs text-emerald-700">
                Your issue has been assigned Ticket ID: <strong>{submittedTicket}</strong>. It has been routed to the relevant municipal department and added to the live tracker below.
              </p>
              <button
                type="button"
                onClick={() => setSubmittedTicket(null)}
                className="mt-2 text-xs font-semibold text-emerald-800 underline hover:text-emerald-950 cursor-pointer"
              >
                File another report &rarr;
              </button>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-800">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Grievance Summary / Title *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Broken water mains flooding pedestrian footpath"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-hidden focus:ring-1 focus:ring-blue-600"
          />
        </div>

        {/* Category & Ward */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Category *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ComplaintCategory)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-hidden focus:ring-1 focus:ring-blue-600 bg-white"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Ward / Administrative Sector
            </label>
            <select
              value={ward}
              onChange={(e) => setWard(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-hidden focus:ring-1 focus:ring-blue-600 bg-white"
            >
              <option value="Ward 14 - Central Metro">Ward 14 - Central Metro</option>
              <option value="Ward 22 - Tech Hub">Ward 22 - Tech Hub</option>
              <option value="Ward 08 - Railway Sector">Ward 08 - Railway Sector</option>
              <option value="Ward 18 - Green Belt">Ward 18 - Green Belt</option>
              <option value="Ward 11 - North District">Ward 11 - North District</option>
            </select>
          </div>
        </div>

        {/* Road Location */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Corridor / Road Location *
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <select
              value={road}
              onChange={(e) => setRoad(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-hidden focus:ring-1 focus:ring-blue-600 bg-white"
            >
              {availableRoads.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
              <option value="OTHER">Other / Custom Street Name...</option>
            </select>

            {road === "OTHER" && (
              <input
                type="text"
                placeholder="Type specific road/landmark name"
                value={customRoad}
                onChange={(e) => setCustomRoad(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-hidden focus:ring-1 focus:ring-blue-600"
              />
            )}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Detailed Description & Hazard Severity *
          </label>
          <textarea
            required
            rows={3}
            placeholder="Describe the exact location, whether ongoing construction machinery is involved, and immediate safety hazards..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-hidden focus:ring-1 focus:ring-blue-600"
          />
        </div>

        {/* Reporter Name & Simulation toggle */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Reported By (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Ramesh S. or anonymous"
              value={reportedBy}
              onChange={(e) => setReportedBy(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-hidden focus:ring-1 focus:ring-blue-600"
            />
          </div>

          <div className="flex items-center gap-2 pt-5">
            <input
              type="checkbox"
              id="photo-sim"
              checked={hasPhoto}
              onChange={(e) => setHasPhoto(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
            <label htmlFor="photo-sim" className="text-xs font-medium text-slate-600 cursor-pointer select-none">
              Attach on-site geotagged photo evidence (Simulated)
            </label>
          </div>
        </div>

        {/* Submit button */}
        <div className="pt-3 flex items-center justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 rounded-lg bg-blue-900 px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-blue-800 transition-colors cursor-pointer"
          >
            <PlusIcon className="w-4 h-4" />
            <span>Submit Citizen Grievance</span>
          </button>
        </div>
      </form>
    </div>
  );
}
