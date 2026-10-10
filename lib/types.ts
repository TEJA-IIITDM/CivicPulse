
export type ProjectStatus =
  | "Planned"
  | "In Progress"
  | "Delayed"
  | "Completed";

export type ProjectCategory =
  | "Road Work"
  | "Water & Sanitation"
  | "Stormwater Drainage"
  | "Underground Utilities"
  | "Public Transit"
  | "Electrical & Lighting";

export type ConflictSeverity = "Low" | "Medium" | "High";

export type ComplaintStatus =
  | "Pending Review"
  | "Under Investigation"
  | "Action Scheduled"
  | "Resolved";

export type ComplaintCategory =
  | "Potholes & Road Damage"
  | "Water Leakage & Pipeline Burst"
  | "Clogged Drain & Waterlogging"
  | "Faulty Streetlights"
  | "Garbage & Debris on Road"
  | "Unmarked Road Excavation";

export type Project = {
  id: string;
  name: string;
  road: string;
  ward: string;
  department: string;
  category: ProjectCategory;
  status: ProjectStatus;
  progress: number;
  startDate: string;
  deadline: string;
  description: string;
  budget: string;
  contractor: string;
  impactLevel: "Low" | "Moderate" | "High";
};

export type Complaint = {
  id: string;
  ticketNumber: string;
  title: string;
  description: string;
  road: string;
  ward: string;
  category: ComplaintCategory;
  status: ComplaintStatus;
  createdAt: string;
  reportedBy: string;
  upvotes: number;
  assignedDepartment: string;
};

export type WardLocation = {
  id: string;
  name: string;
  zone: string;
  roads: string[];
  activeProjects: number;
  conflictsCount: number;
  complaintsCount: number;
  coordinates: {
    x: number;
    y: number;
  };
};

export type ProjectConflict = {
  id: string;
  road: string;
  ward: string;
  project1: Project;
  project2: Project;
  overlapStart: string;
  overlapEnd: string;
  conflictType: string;
  description: string;
  severity: ConflictSeverity;
  suggestedAction: string;
};