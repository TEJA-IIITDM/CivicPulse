import type { Project, ProjectConflict, ConflictSeverity } from "@/lib/types";

/**
 * Checks if two date ranges [startA, endA] and [startB, endB] overlap.
 */
function datesOverlap(startA: string, endA: string, startB: string, endB: string): boolean {
  const sA = new Date(startA).getTime();
  const eA = new Date(endA).getTime();
  const sB = new Date(startB).getTime();
  const eB = new Date(endB).getTime();

  return sA <= eB && sB <= eA;
}

/**
 * Calculates the overlapping date string [overlapStart, overlapEnd].
 */
function getOverlapRange(startA: string, endA: string, startB: string, endB: string): { start: string; end: string } {
  const sA = new Date(startA).getTime();
  const eA = new Date(endA).getTime();
  const sB = new Date(startB).getTime();
  const eB = new Date(endB).getTime();

  const maxStart = new Date(Math.max(sA, sB)).toISOString().split("T")[0];
  const minEnd = new Date(Math.min(eA, eB)).toISOString().split("T")[0];

  return { start: maxStart, end: minEnd };
}

/**
 * Determines conflict nature and provides understandable civil engineering reasoning.
 */
function evaluateConflictDetails(p1: Project, p2: Project): {
  conflictType: string;
  description: string;
  severity: ConflictSeverity;
  suggestedAction: string;
} {
  const cat1 = p1.category;
  const cat2 = p2.category;

  // Case 1: Road resurfacing vs underground pipe / drain / utility excavation
  if (
    (cat1 === "Road Work" && (cat2 === "Water & Sanitation" || cat2 === "Stormwater Drainage" || cat2 === "Underground Utilities")) ||
    (cat2 === "Road Work" && (cat1 === "Water & Sanitation" || cat1 === "Stormwater Drainage" || cat1 === "Underground Utilities"))
  ) {
    const roadProject = cat1 === "Road Work" ? p1 : p2;
    const diggingProject = cat1 === "Road Work" ? p2 : p1;

    return {
      conflictType: "Excavation Clashing with Surface Resurfacing",
      description: `"${diggingProject.name}" (${diggingProject.department}) involves deep trenching on ${p1.road}, overlapping with "${roadProject.name}" (${roadProject.department}). Digging newly laid bitumen destroys road integrity and duplicates expenditure.`,
      severity: "High",
      suggestedAction: `Sequence "${diggingProject.name}" first. Delay the asphalt resurfacing by 3 weeks until underground pipeline compaction is certified.`,
    };
  }

  // Case 2: Water & Sanitation vs Stormwater Drainage
  if (
    (cat1 === "Water & Sanitation" && cat2 === "Stormwater Drainage") ||
    (cat2 === "Water & Sanitation" && cat1 === "Stormwater Drainage")
  ) {
    return {
      conflictType: "Dual Trenching & Flood Vulnerability",
      description: `Simultaneous excavation by ${p1.department} and ${p2.department} on ${p1.road} risks breaking sewer lines into stormwater beds and total traffic cutoff.`,
      severity: "High",
      suggestedAction: `Hold a joint site inspection with Municipal Works Cell. Designate shared utility ducts before ground-breaking.`,
    };
  }

  // Case 3: Public Transit vs Road/Utility
  if (cat1 === "Public Transit" || cat2 === "Public Transit") {
    return {
      conflictType: "Transit Corridor Bottleneck",
      description: `Concurrent works by ${p1.department} and ${p2.department} on ${p1.road} will close more than 60% of carriage-way width.`,
      severity: "High",
      suggestedAction: `Coordinate traffic diversions with City Traffic Police; stagger heavy machinery movement to night hours (11 PM - 5 AM).`,
    };
  }

  // Default: General road occupancy conflict
  return {
    conflictType: "Concurrent Right-of-Way Blockage",
    description: `Multiple agencies (${p1.department} & ${p2.department}) have scheduled active civil works on ${p1.road} simultaneously.`,
    severity: "Medium",
    suggestedAction: `Stagger work zones by 500-meter segments or adjust execution dates to prevent total corridor gridlock.`,
  };
}

/**
 * Scans all infrastructure projects and identifies overlaps on the same road.
 */
export function detectProjectConflicts(projects: Project[]): ProjectConflict[] {
  const conflicts: ProjectConflict[] = [];

  // Group active or scheduled projects by normalized road name
  const roadMap = new Map<string, Project[]>();

  projects.forEach((proj) => {
    // Only evaluate non-completed projects for current conflict detection
    if (proj.status === "Completed") return;

    const normalizedRoad = proj.road.trim().toLowerCase();
    if (!roadMap.has(normalizedRoad)) {
      roadMap.set(normalizedRoad, []);
    }
    roadMap.get(normalizedRoad)!.push(proj);
  });

  // Check each road group for pairwise overlaps
  roadMap.forEach((roadProjects) => {
    if (roadProjects.length < 2) return;

    for (let i = 0; i < roadProjects.length; i++) {
      for (let j = i + 1; j < roadProjects.length; j++) {
        const p1 = roadProjects[i];
        const p2 = roadProjects[j];

        if (datesOverlap(p1.startDate, p1.deadline, p2.startDate, p2.deadline)) {
          const overlap = getOverlapRange(p1.startDate, p1.deadline, p2.startDate, p2.deadline);
          const evaluation = evaluateConflictDetails(p1, p2);

          conflicts.push({
            id: `conflict-${p1.id}-${p2.id}`,
            road: p1.road,
            ward: p1.ward,
            project1: p1,
            project2: p2,
            overlapStart: overlap.start,
            overlapEnd: overlap.end,
            conflictType: evaluation.conflictType,
            description: evaluation.description,
            severity: evaluation.severity,
            suggestedAction: evaluation.suggestedAction,
          });
        }
      }
    }
  });

  return conflicts;
}
