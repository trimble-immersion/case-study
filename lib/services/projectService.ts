import type { Project } from "@/lib/domain/types";
import { projectStore, ensureSeeded } from "@/lib/data/store";

export function listProjects(): Project[] {
  ensureSeeded();
  return [...projectStore];
}

export function getProjectById(id: string): Project | undefined {
  ensureSeeded();
  return projectStore.find((p) => p.id === id);
}
