
import type {
  Project,
  ProjectConflict,
  ConflictSeverity,
} from "@/lib/types";

const UNDERGROUND_CATEGORIES = new Set<string>([
  "Water & Sanitation",
  "Stormwater Drainage",
  "Underground Utilities",
]);

function normalizeText(value: string): string {
  return value
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function parseDate(value: string): number | null {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return null;
  }

  const timestamp = Date.parse(`${value}T00:00:00.000Z`);

  if (!Number.isFinite(timestamp)) {
    return null;
  }

  if (new Date(timestamp).toISOString().slice(0, 10) !== value) {
    return null;
  }

  return timestamp;
}

function getValidRange(project: Project) {
  const start = parseDate(project.startDate);
  const end = parseDate(project.deadline);

  if (start === null || end === null || start > end) {
    return null;
  }

  return { start, end };
}

function evaluateConflict(
  p1: Project,
  p2: Project
): {
  conflictType: string;
  description: string;
  severity: ConflictSeverity;
  suggestedAction: string;
} {
  const roadWorkConflict =
    (p1.category === "Road Work" &&
      UNDERGROUND_CATEGORIES.has(p2.category)) ||
    (p2.category === "Road Work" &&
      UNDERGROUND_CATEGORIES.has(p1.category));

  const waterDrainageConflict =
    (p1.category === "Water & Sanitation" &&
      p2.category === "Stormwater Drainage") ||
    (p2.category === "Water & Sanitation" &&
      p1.category === "Stormwater Drainage");

  const transitConflict =
    p1.category === "Public Transit" ||
    p2.category === "Public Transit";

  const highImpact =
    p1.impactLevel === "High" ||
    p2.impactLevel === "High";

  let conflictType: string;
  let description: string;
  let severity: ConflictSeverity;
  let suggestedAction: string;

  if (roadWorkConflict) {
    const roadProject =
      p1.category === "Road Work" ? p1 : p2;
    const utilityProject =
      roadProject.id === p1.id ? p2 : p1;

    conflictType = "Road Work and Utility Schedule Overlap";
    description =
      `"${roadProject.name}" and "${utilityProject.name}" have overlapping scheduled dates on ${p1.road}. ` +
      "Utility excavation may damage newly completed road surfaces if the work sequence is not coordinated.";

    suggestedAction =
      "Review the work sequence with both departments. Confirm underground utility work and reinstatement before final road surfacing.";

    severity = "High";
  } else if (waterDrainageConflict) {
    conflictType = "Water and Drainage Work Overlap";
    description =
      `"${p1.name}" and "${p2.name}" have overlapping scheduled dates on ${p1.road}. ` +
      "Their excavation zones and underground layouts should be checked for physical interference.";

    suggestedAction =
      "Arrange a joint site and utility-plan review before work proceeds in the shared corridor.";

    severity = "High";
  } else if (transitConflict) {
    conflictType = "Transit Corridor Schedule Overlap";
    description =
      `"${p1.name}" and "${p2.name}" have overlapping scheduled dates on ${p1.road}. ` +
      "Check whether simultaneous work affects transit access, traffic flow, or safe work-zone arrangements.";

    suggestedAction =
      "Review traffic management and transit access with the relevant departments. Stagger work if the site assessment confirms competing space requirements.";

    severity = highImpact ? "High" : "Medium";
  } else {
    conflictType = "Shared Road Work Schedule Overlap";
    description =
      `"${p1.name}" and "${p2.name}" have overlapping scheduled dates on ${p1.road}. ` +
      "A site-level review is needed to determine whether the work zones or access requirements interfere.";

    suggestedAction =
      "Compare work-zone boundaries and planned access. Coordinate schedules if the projects compete for the same road space.";

    severity = highImpact ? "High" : "Medium";
  }

  if (
    p1.status === "Delayed" ||
    p2.status === "Delayed"
  ) {
    description +=
      " At least one project is marked delayed; confirm its latest schedule before finalizing coordination.";
  }

  return {
    conflictType,
    description,
    severity,
    suggestedAction,
  };
}

export function detectProjectConflicts(
  projects: Project[]
): ProjectConflict[] {
  const roadMap = new Map<string, Project[]>();

  for (const project of projects) {
    if (project.status === "Completed") continue;

    const road = normalizeText(project.road);
    const ward = normalizeText(project.ward);

    if (!road || !ward) continue;
    if (!getValidRange(project)) continue;

    const key = `${ward}::${road}`;
    const existing = roadMap.get(key) ?? [];

    existing.push(project);
    roadMap.set(key, existing);
  }

  const conflicts: ProjectConflict[] = [];

  for (const roadProjects of roadMap.values()) {
    for (let i = 0; i < roadProjects.length; i++) {
      for (let j = i + 1; j < roadProjects.length; j++) {
        const p1 = roadProjects[i];
        const p2 = roadProjects[j];

        if (p1.id === p2.id) continue;

        const range1 = getValidRange(p1);
        const range2 = getValidRange(p2);

        if (!range1 || !range2) continue;

        const overlaps =
          range1.start <= range2.end &&
          range2.start <= range1.end;

        if (!overlaps) continue;

        const overlapStart = Math.max(
          range1.start,
          range2.start
        );

        const overlapEnd = Math.min(
          range1.end,
          range2.end
        );

        const evaluation = evaluateConflict(p1, p2);

        conflicts.push({
          id: `conflict-${p1.id}-${p2.id}`,
          road: p1.road,
          ward: p1.ward,
          project1: p1,
          project2: p2,
          overlapStart: new Date(overlapStart)
            .toISOString()
            .slice(0, 10),
          overlapEnd: new Date(overlapEnd)
            .toISOString()
            .slice(0, 10),
          ...evaluation,
        });
      }
    }
  }

  return conflicts;
}