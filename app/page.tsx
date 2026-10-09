"use client";

import React, { useState, useMemo } from "react";
import Sidebar, { NavTab } from "@/components/Sidebar";
import Header from "@/components/Header";
import ProjectCard from "@/components/ProjectCard";
import ConflictCard from "@/components/ConflictCard";
import ComplaintForm from "@/components/ComplaintForm";
import ComplaintList from "@/components/ComplaintList";
import LocationMapView from "@/components/LocationMapView";
import StatusBadge from "@/components/StatusBadge";
import ComplaintBadge from "@/components/ComplaintBadge";
import {
  DashboardIcon,
  ProjectIcon,
  ConflictIcon,
  ComplaintIcon,
  MapIcon,
  SearchIcon,
  FilterIcon,
  PlusIcon,
  CheckCircleIcon,
  BuildingIcon,
  CalendarIcon,
  PinIcon,
  ArrowRightIcon,
  ShieldAlertIcon,
} from "@/components/Icons";

import type { Project, Complaint, ComplaintStatus, ProjectStatus, ProjectCategory } from "@/lib/types";
import { initialProjects, initialComplaints, sampleWards } from "@/lib/mockData";
import { detectProjectConflicts } from "@/lib/conflictDetector";

export default function Home() {
  const [activeTab, setActiveTab] = useState<NavTab>("dashboard");
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [complaints, setComplaints] = useState<Complaint[]>(initialComplaints);

  // Dynamic conflict calculation using our automated detector
  const conflicts = useMemo(() => {
    return detectProjectConflicts(projects);
  }, [projects]);

  // Project catalog filters
  const [projectSearch, setProjectSearch] = useState("");
  const [projectStatusFilter, setProjectStatusFilter] = useState<string>("ALL");
  const [projectCategoryFilter, setProjectCategoryFilter] = useState<string>("ALL");

  // Add Project Modal state
  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);
  const [newProjName, setNewProjName] = useState("");
  const [newProjRoad, setNewProjRoad] = useState("MG Road Corridor");
  const [newProjDept, setNewProjDept] = useState("Public Works Department (PWD)");
  const [newProjCategory, setNewProjCategory] = useState<ProjectCategory>("Road Work");
  const [newProjStatus, setNewProjStatus] = useState<ProjectStatus>("Planned");
  const [newProjStartDate, setNewProjStartDate] = useState("2026-11-01");
  const [newProjDeadline, setNewProjDeadline] = useState("2026-12-01");
  const [newProjDesc, setNewProjDesc] = useState("");

  // KPI Calculations
  const totalProjects = projects.length;
  const ongoingProjects = projects.filter((p) => p.status === "In Progress").length;
  const delayedProjects = projects.filter((p) => p.status === "Delayed").length;
  const resolvedComplaints = complaints.filter((c) => c.status === "Resolved").length;
  const totalComplaints = complaints.length;

  // Handlers
  const handleComplaintSubmitted = (newComplaint: Complaint) => {
    setComplaints((prev) => [newComplaint, ...prev]);
  };

  const handleUpvoteComplaint = (id: string) => {
    setComplaints((prev) =>
      prev.map((c) => (c.id === id ? { ...c, upvotes: c.upvotes + 1 } : c))
    );
  };

  const handleComplaintStatusChange = (id: string, newStatus: ComplaintStatus) => {
    setComplaints((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
    );
  };

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjName.trim()) return;

    const newProject: Project = {
      id: `proj-${Date.now()}`,
      name: newProjName.trim(),
      road: newProjRoad,
      ward: "Ward 14 - Central Metro",
      department: newProjDept,
      category: newProjCategory,
      status: newProjStatus,
      progress: newProjStatus === "In Progress" ? 25 : 0,
      startDate: newProjStartDate,
      deadline: newProjDeadline,
      description: newProjDesc.trim() || `Infrastructure civil works on ${newProjRoad}.`,
      budget: "$350,000",
      impactLevel: "Moderate",
    };

    setProjects((prev) => [newProject, ...prev]);
    setIsAddProjectOpen(false);
    setNewProjName("");
    setNewProjDesc("");
  };

  // Filtered projects for the Projects tab
  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(projectSearch.toLowerCase()) ||
      p.road.toLowerCase().includes(projectSearch.toLowerCase()) ||
      p.department.toLowerCase().includes(projectSearch.toLowerCase());

    const matchesStatus = projectStatusFilter === "ALL" || p.status === projectStatusFilter;
    const matchesCat = projectCategoryFilter === "ALL" || p.category === projectCategoryFilter;

    return matchesSearch && matchesStatus && matchesCat;
  });

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans text-slate-800">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        conflictCount={conflicts.length}
        complaintCount={complaints.length}
        projectCount={projects.length}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <Header
          activeTab={activeTab}
          onTabChange={setActiveTab}
          conflictCount={conflicts.length}
        />

        {/* Tab Body */}
        <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6">
          {/* ============================================================== */}
          {/* TAB 1: EXECUTIVE DASHBOARD */}
          {/* ============================================================== */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              {/* Feature 1: KPI Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Projects */}
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Total Infrastructure Works
                    </span>
                    <div className="p-2 rounded-lg bg-blue-50 text-blue-800">
                      <ProjectIcon className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-3xl font-black text-slate-900 tracking-tight">
                      {totalProjects}
                    </span>
                    <span className="text-xs font-medium text-slate-500">
                      active & planned
                    </span>
                  </div>
                  <p className="mt-2 text-[11px] text-slate-500 flex items-center gap-1">
                    <span>$3.9M municipal allocation</span>
                  </p>
                </div>

                {/* Ongoing Projects */}
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Ongoing Civil Works
                    </span>
                    <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                      <BuildingIcon className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-3xl font-black text-blue-900 tracking-tight">
                      {ongoingProjects}
                    </span>
                    <span className="text-xs font-medium text-slate-500">
                      in construction
                    </span>
                  </div>
                  <p className="mt-2 text-[11px] text-blue-600 font-medium">
                    Roads, pipelines & culverts
                  </p>
                </div>

                {/* Delayed Projects */}
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Delayed Projects
                    </span>
                    <div className="p-2 rounded-lg bg-rose-50 text-rose-600">
                      <CalendarIcon className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-3xl font-black text-rose-700 tracking-tight">
                      {delayedProjects}
                    </span>
                    <span className="text-xs font-medium text-slate-500">
                      past target deadline
                    </span>
                  </div>
                  <p className="mt-2 text-[11px] text-rose-600 font-medium">
                    Requires inter-utility escalation
                  </p>
                </div>

                {/* Resolved Complaints */}
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Resolved Grievances
                    </span>
                    <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                      <CheckCircleIcon className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-3xl font-black text-emerald-700 tracking-tight">
                      {resolvedComplaints}
                    </span>
                    <span className="text-xs font-medium text-slate-500">
                      / {totalComplaints} citizen reports
                    </span>
                  </div>
                  <p className="mt-2 text-[11px] text-emerald-600 font-medium">
                    {Math.round((resolvedComplaints / (totalComplaints || 1)) * 100)}% redressal rate
                  </p>
                </div>
              </div>

              {/* Feature 3: Highlight Conflict Warning Banner */}
              {conflicts.length > 0 && (
                <div className="rounded-xl border border-rose-300 bg-gradient-to-r from-rose-50 via-amber-50 to-white p-5 shadow-sm">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="rounded-lg bg-rose-600 p-2.5 text-white shadow-xs">
                        <ConflictIcon className="w-6 h-6 animate-pulse" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="rounded bg-rose-200 px-2 py-0.5 text-[11px] font-bold text-rose-900 uppercase">
                            High Priority Warning
                          </span>
                          <span className="text-xs font-bold text-rose-800">
                            {conflicts.length} Road Clashes Detected
                          </span>
                        </div>
                        <h3 className="mt-1 text-base font-bold text-slate-900">
                          Overlapping Civil Works Threaten New Pavement on MG Road & Outer Ring Road
                        </h3>
                        <p className="mt-0.5 text-xs text-slate-600 max-w-3xl leading-relaxed">
                          Multiple departments (PWD, Water Board, Telecom) have uncoordinated excavation windows on the same corridors. Review conflicts to adjust start dates and prevent duplicate road-cutting.
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => setActiveTab("conflicts")}
                      className="flex-shrink-0 flex items-center gap-1.5 rounded-lg bg-rose-700 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-rose-800 transition-colors cursor-pointer"
                    >
                      <span>Resolve Conflicts</span>
                      <ArrowRightIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Dashboard Split View: Active Works & Citizen Grievance Feed */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Active Works Column (7 cols) */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">
                          Active & Critical Infrastructure Works
                        </h3>
                        <p className="text-xs text-slate-500">
                          Sample road repairs, water pipelines & drainage projects
                        </p>
                      </div>
                      <button
                        onClick={() => setActiveTab("projects")}
                        className="text-xs font-semibold text-blue-700 hover:text-blue-900 hover:underline cursor-pointer"
                      >
                        View all ({projects.length}) &rarr;
                      </button>
                    </div>

                    <div className="mt-4 space-y-3">
                      {projects.slice(0, 3).map((proj) => {
                        const hasConflict = conflicts.some((c) => c.road === proj.road);
                        return (
                          <ProjectCard
                            key={proj.id}
                            project={proj}
                            hasConflict={hasConflict}
                            onConflictClick={() => setActiveTab("conflicts")}
                          />
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Grievances & Redressal Column (5 cols) */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">
                          Latest Citizen Complaints
                        </h3>
                        <p className="text-xs text-slate-500">
                          Recent public reports logged via CivicLens
                        </p>
                      </div>
                      <button
                        onClick={() => setActiveTab("tracking")}
                        className="text-xs font-semibold text-blue-700 hover:text-blue-900 hover:underline cursor-pointer"
                      >
                        All ({complaints.length}) &rarr;
                      </button>
                    </div>

                    <div className="mt-4 space-y-3">
                      {complaints.slice(0, 4).map((c) => (
                        <div
                          key={c.id}
                          className="rounded-lg border border-slate-100 bg-slate-50/50 p-3 hover:bg-slate-50 transition-colors"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-mono text-[10px] font-bold text-blue-900 bg-blue-100/60 px-1.5 py-0.2 rounded">
                              {c.ticketNumber}
                            </span>
                            <ComplaintBadge status={c.status} />
                          </div>

                          <h4 className="mt-1 text-xs font-bold text-slate-900 line-clamp-1">
                            {c.title}
                          </h4>

                          <p className="mt-0.5 text-[11px] text-slate-500 flex items-center gap-1">
                            <PinIcon className="w-3 h-3 text-slate-400" />
                            <span>{c.road}</span>
                            <span className="text-slate-300">•</span>
                            <span>{c.category}</span>
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100">
                      <button
                        onClick={() => setActiveTab("report")}
                        className="w-full flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        <PlusIcon className="w-3.5 h-3.5 text-blue-700" />
                        <span>Submit a Grievance Report</span>
                      </button>
                    </div>
                  </div>

                  {/* Ward Quick Map Teaser */}
                  <div
                    onClick={() => setActiveTab("map")}
                    className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs hover:border-blue-300 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MapIcon className="w-4 h-4 text-blue-700" />
                        <h4 className="text-xs font-bold text-slate-900">
                          Corridor & Ward Map
                        </h4>
                      </div>
                      <span className="text-xs font-semibold text-blue-700 group-hover:translate-x-0.5 transition-transform">
                        Explore &rarr;
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Interactive road corridor grid with real-time overlap and hazard flags across 5 municipal wards.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 2: INFRASTRUCTURE PROJECTS */}
          {/* ============================================================== */}
          {activeTab === "projects" && (
            <div className="space-y-6">
              {/* Controls bar */}
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
                {/* Search */}
                <div className="relative w-full md:w-80">
                  <SearchIcon className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search projects, roads, agencies..."
                    value={projectSearch}
                    onChange={(e) => setProjectSearch(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 pl-9 pr-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-hidden"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                  {/* Category Filter */}
                  <select
                    value={projectCategoryFilter}
                    onChange={(e) => setProjectCategoryFilter(e.target.value)}
                    className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-700 bg-white focus:border-blue-600 focus:outline-hidden"
                  >
                    <option value="ALL">All Categories</option>
                    <option value="Road Work">Road Work</option>
                    <option value="Water & Sanitation">Water & Sanitation</option>
                    <option value="Stormwater Drainage">Stormwater Drainage</option>
                    <option value="Electrical & Lighting">Electrical & Lighting</option>
                    <option value="Underground Utilities">Underground Utilities</option>
                    <option value="Public Transit">Public Transit</option>
                  </select>

                  {/* Status Filter */}
                  <select
                    value={projectStatusFilter}
                    onChange={(e) => setProjectStatusFilter(e.target.value)}
                    className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-700 bg-white focus:border-blue-600 focus:outline-hidden"
                  >
                    <option value="ALL">All Statuses</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Planned">Planned</option>
                    <option value="Delayed">Delayed</option>
                    <option value="Completed">Completed</option>
                  </select>

                  {/* Add Project CTA */}
                  <button
                    onClick={() => setIsAddProjectOpen(true)}
                    className="flex items-center gap-1.5 rounded-lg bg-blue-900 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-blue-800 transition-colors shadow-2xs cursor-pointer ml-auto"
                  >
                    <PlusIcon className="w-3.5 h-3.5" />
                    <span>Add Project</span>
                  </button>
                </div>
              </div>

              {/* Projects Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProjects.map((proj) => {
                  const hasConflict = conflicts.some((c) => c.road === proj.road);
                  return (
                    <ProjectCard
                      key={proj.id}
                      project={proj}
                      hasConflict={hasConflict}
                      onConflictClick={() => setActiveTab("conflicts")}
                    />
                  );
                })}
              </div>

              {filteredProjects.length === 0 && (
                <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center">
                  <p className="text-sm font-semibold text-slate-600">No infrastructure works found.</p>
                  <p className="text-xs text-slate-400 mt-1">Try clearing your filters or search keywords.</p>
                </div>
              )}
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 3: CONFLICT DETECTION ENGINE */}
          {/* ============================================================== */}
          {activeTab === "conflicts" && (
            <div className="space-y-6">
              {/* Overview & Educational Card */}
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div>
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-bold text-rose-700 border border-rose-200">
                      <ShieldAlertIcon className="w-3.5 h-3.5 text-rose-600" />
                      <span>Automatic Inter-Utility Coordination</span>
                    </div>
                    <h2 className="mt-2 text-xl font-bold text-slate-900">
                      Right-of-Way & Schedule Conflict Engine
                    </h2>
                    <p className="mt-1 text-xs text-slate-500 max-w-2xl">
                      In civic governance, cities lose millions when roads are resurfaced only to be dug up weeks later by the water board or telecom agency. CivicLens continuously compares road coordinates and date windows to identify these collisions before work permits are issued.
                    </p>
                  </div>

                  {/* Conflict stats pill */}
                  <div className="rounded-lg bg-slate-900 p-4 text-white flex-shrink-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Active Collisions
                    </span>
                    <span className="text-2xl font-black text-rose-400">
                      {conflicts.length} Overlaps
                    </span>
                    <span className="text-[11px] text-slate-400 block mt-0.5">
                      across {new Set(conflicts.map((c) => c.road)).size} major corridors
                    </span>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600">
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                    <strong className="text-slate-900 block font-bold mb-1">1. Detection Rule</strong>
                    Identifies concurrent non-completed projects sharing the identical road corridor during overlapping calendar periods.
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                    <strong className="text-slate-900 block font-bold mb-1">2. Severity Calculation</strong>
                    Trenching & pipe-laying under newly laid asphalt is classified as High Severity due to immediate structural degradation.
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                    <strong className="text-slate-900 block font-bold mb-1">3. Mitigation Guidance</strong>
                    Proposes actionable sequencing so underground utilities finish hydro-testing before paving crews lay hot bitumen.
                  </div>
                </div>
              </div>

              {/* Conflict Cards List */}
              <div className="space-y-4">
                {conflicts.map((conflict) => (
                  <ConflictCard key={conflict.id} conflict={conflict} />
                ))}

                {conflicts.length === 0 && (
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-12 text-center">
                    <CheckCircleIcon className="w-10 h-10 text-emerald-600 mx-auto" />
                    <h3 className="text-base font-bold text-emerald-900 mt-2">
                      Zero Inter-Agency Schedule Conflicts Detected!
                    </h3>
                    <p className="text-xs text-emerald-700 mt-1">
                      All municipal departments have sequenced their road corridor works smoothly.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 4: REPORT A COMPLAINT */}
          {/* ============================================================== */}
          {activeTab === "report" && (
            <div className="max-w-3xl mx-auto space-y-6">
              <ComplaintForm
                onComplaintSubmitted={(newC) => {
                  handleComplaintSubmitted(newC);
                }}
              />
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 5: COMPLAINT TRACKING */}
          {/* ============================================================== */}
          {activeTab === "tracking" && (
            <div className="space-y-6">
              <ComplaintList
                complaints={complaints}
                onUpvote={handleUpvoteComplaint}
                onStatusChange={handleComplaintStatusChange}
              />
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 6: CORRIDOR & GIS MAP */}
          {/* ============================================================== */}
          {activeTab === "map" && (
            <div className="space-y-6">
              <LocationMapView
                projects={projects}
                conflicts={conflicts}
                complaints={complaints}
                wards={sampleWards}
              />
            </div>
          )}
        </main>
      </div>

      {/* Add Project Modal for Testing */}
      {isAddProjectOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-xl border border-slate-200 bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                Log New Public Works Project
              </h3>
              <button
                onClick={() => setIsAddProjectOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer font-bold"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Project Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Gas Pipeline Secondary Line Trenching"
                  value={newProjName}
                  onChange={(e) => setNewProjName(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-900 focus:border-blue-600 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Corridor / Road *
                  </label>
                  <select
                    value={newProjRoad}
                    onChange={(e) => setNewProjRoad(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-900 bg-white"
                  >
                    <option value="MG Road Corridor">MG Road Corridor</option>
                    <option value="Outer Ring Road">Outer Ring Road</option>
                    <option value="Station Road">Station Road</option>
                    <option value="Lake View Avenue">Lake View Avenue</option>
                    <option value="Anna Salai Arterial">Anna Salai Arterial</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Department
                  </label>
                  <select
                    value={newProjDept}
                    onChange={(e) => setNewProjDept(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-900 bg-white"
                  >
                    <option value="Public Works Department (PWD)">Public Works Dept (PWD)</option>
                    <option value="Water Supply & Sewerage Board (BWSSB)">Water Supply & Sewerage</option>
                    <option value="Stormwater Drainage Dept">Stormwater Drainage</option>
                    <option value="Gas Utility Infrastructure Corp">Gas Utility Corp</option>
                    <option value="Telecommunications Cell">Telecommunications</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Category
                  </label>
                  <select
                    value={newProjCategory}
                    onChange={(e) => setNewProjCategory(e.target.value as ProjectCategory)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-900 bg-white"
                  >
                    <option value="Road Work">Road Work</option>
                    <option value="Water & Sanitation">Water & Sanitation</option>
                    <option value="Stormwater Drainage">Stormwater Drainage</option>
                    <option value="Electrical & Lighting">Electrical & Lighting</option>
                    <option value="Underground Utilities">Underground Utilities</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Status
                  </label>
                  <select
                    value={newProjStatus}
                    onChange={(e) => setNewProjStatus(e.target.value as ProjectStatus)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-900 bg-white"
                  >
                    <option value="Planned">Planned</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Delayed">Delayed</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={newProjStartDate}
                    onChange={(e) => setNewProjStartDate(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Completion Deadline
                  </label>
                  <input
                    type="date"
                    value={newProjDeadline}
                    onChange={(e) => setNewProjDeadline(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Scope & Scope Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Describe the right-of-way, excavation depth, or road closure..."
                  value={newProjDesc}
                  onChange={(e) => setNewProjDesc(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-900"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddProjectOpen(false)}
                  className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-900 px-4 py-1.5 text-xs font-bold text-white hover:bg-blue-800 cursor-pointer"
                >
                  Save Project & Check Conflicts
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
