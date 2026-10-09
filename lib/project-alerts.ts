
import type { Project } from "./types";

export type ProjectAlert = {
  id: string;
  type: "overdue" | "coordination";
  message: string;
  projectIds: string[];
};

export function getProjectAlerts(
  projects: Project[],
  today = new Date().toISOString().slice(0, 10)
): ProjectAlert[] {
  const alerts: ProjectAlert[] = [];

  for (const project of projects) {
    if (
      project.status !== "Completed" &&
      project.deadline < today
    ) {
      alerts.push({
        id: `overdue-${project.id}`,
        type: "overdue",
        message: `${project.name} is past its deadline.`,
        projectIds: [project.id],
      });
    }
  }

  for (let i = 0; i < projects.length; i++) {
    for (let j = i + 1; j < projects.length; j++) {
      const a = projects[i];
      const b = projects[j];

      const sameRoad =
        a.road.trim().toLowerCase() ===
        b.road.trim().toLowerCase();

      const datesOverlap =
        a.startDate <= b.deadline &&
        b.startDate <= a.deadline;

      if (sameRoad && datesOverlap) {
        alerts.push({
          id: `coordination-${a.id}-${b.id}`,
          type: "coordination",
          message:
            `${a.name} and ${b.name} have overlapping ` +
            `scheduled dates on ${a.road}. Review coordination.`,
          projectIds: [a.id, b.id],
        });
      }
    }
  }

  return alerts;
}