/**
 * Rules-based "fake AI" pricing for change orders.
 * suggestedTotal = labor (hours × rate) + materials + equipment (with margin).
 */

const LABOR_RATE_PER_HOUR = 85;
const EQUIPMENT_MARGIN = 1.15; // 15% markup on equipment

export function computeSuggestedTotal(
  labor: number,
  materials: number,
  equipment: number
): number {
  const laborCost = labor * LABOR_RATE_PER_HOUR;
  const equipmentCost = equipment * EQUIPMENT_MARGIN;
  return Math.round((laborCost + materials + equipmentCost) * 100) / 100;
}
