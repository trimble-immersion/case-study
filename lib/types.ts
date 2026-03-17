export type ChangeOrderStatus = "draft" | "approved";

export interface ChangeOrder {
  id: string;
  title: string;
  description: string;
  labor: number;
  materials: number;
  equipment: number;
  suggestedTotal: number;
  finalTotal: number;
  status: ChangeOrderStatus;
  createdAt: string; // ISO date string
}

export interface ChangeOrderInput {
  title: string;
  description: string;
  labor: number;
  materials: number;
  equipment: number;
}
