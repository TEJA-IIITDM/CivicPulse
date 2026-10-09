
export type ProjectStatus =
  | "Planned"
  | "In Progress"
  | "Delayed"
  | "Completed";

export type Project = {
  id: string;
  name: string;
  road: string;
  department: string;
  status: ProjectStatus;
  progress: number;
  startDate: string;
  deadline: string;
  description: string;
};

export type CitizenReport = {
  id: string;
  road: string;
  category: string;
  description: string;
  submittedAt: string;
};