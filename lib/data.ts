import type { ChangeOrder, ChangeOrderInput } from "./types";
import { computeSuggestedTotal } from "./pricing";

const store: ChangeOrder[] = [];

const SEED_DATA: Omit<ChangeOrder, "id">[] = [
  { title: "Additional conduit runs", description: "Extra conduit for Phase 2 area", labor: 16, materials: 420, equipment: 200, suggestedTotal: 2200, finalTotal: 2200, status: "approved", createdAt: "2024-01-15T10:00:00Z" },
  { title: "Concrete pad extension", description: "Extend pad by 4ft for generator", labor: 24, materials: 680, equipment: 450, suggestedTotal: 3290, finalTotal: 3290, status: "approved", createdAt: "2024-01-18T14:00:00Z" },
  { title: "Panel upgrade", description: "Upgrade to 400A panel", labor: 12, materials: 1100, equipment: 0, suggestedTotal: 2120, finalTotal: 2120, status: "approved", createdAt: "2024-01-20T09:00:00Z" },
  { title: "Trenching delay", description: "Extra trenching due to rock", labor: 40, materials: 200, equipment: 800, suggestedTotal: 4740, finalTotal: 4740, status: "draft", createdAt: "2024-02-01T11:00:00Z" },
  { title: "Lighting add-on", description: "Six additional exterior lights", labor: 8, materials: 380, equipment: 120, suggestedTotal: 1296, finalTotal: 1296, status: "draft", createdAt: "2024-02-05T08:00:00Z" },
  { title: "HVAC duct modification", description: "Reroute duct in mechanical room", labor: 20, materials: 520, equipment: 0, suggestedTotal: 2220, finalTotal: 2220, status: "draft", createdAt: "2024-02-10T13:00:00Z" },
  { title: "Fire alarm devices", description: "Add 4 pull stations and 6 horns", labor: 14, materials: 890, equipment: 180, suggestedTotal: 2440, finalTotal: 2440, status: "draft", createdAt: "2024-02-12T10:30:00Z" },
];

let seeded = false;
function ensureSeeded(): void {
  if (seeded || store.length > 0) return;
  seeded = true;
  SEED_DATA.forEach((s, i) => {
    store.push({
      ...s,
      id: `seed-${i + 1}-${Date.now().toString(36)}`,
    });
  });
}

function generateId(): string {
  return crypto.randomUUID?.() ?? `co-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function listChanges(): ChangeOrder[] {
  ensureSeeded();
  return [...store];
}

export function listDrafts(): ChangeOrder[] {
  ensureSeeded();
  return store.filter((c) => c.status === "draft");
}

export function listApproved(): ChangeOrder[] {
  ensureSeeded();
  return store.filter((c) => c.status === "approved");
}

export function getChangeById(id: string): ChangeOrder | undefined {
  ensureSeeded();
  return store.find((c) => c.id === id);
}

export function createChange(input: ChangeOrderInput): ChangeOrder {
  const suggestedTotal = computeSuggestedTotal(
    input.labor,
    input.materials,
    input.equipment
  );
  const change: ChangeOrder = {
    id: generateId(),
    ...input,
    suggestedTotal,
    finalTotal: suggestedTotal,
    status: "draft",
    createdAt: new Date().toISOString(),
  };
  store.push(change);
  return change;
}

export function updateChange(
  id: string,
  updates: { finalTotal?: number; status?: ChangeOrder["status"] }
): ChangeOrder | undefined {
  const idx = store.findIndex((c) => c.id === id);
  if (idx === -1) return undefined;
  if (updates.finalTotal !== undefined) store[idx].finalTotal = updates.finalTotal;
  if (updates.status !== undefined) store[idx].status = updates.status;
  return store[idx];
}

export function seedChanges(entries: ChangeOrder[]): void {
  store.length = 0;
  store.push(...entries);
}
