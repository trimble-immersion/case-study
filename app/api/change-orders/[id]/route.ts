import { NextRequest, NextResponse } from "next/server";
import { getChangeOrderById, updateChangeOrder } from "@/lib/services";
import type { ApprovalStatus } from "@/lib/domain/types";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const co = getChangeOrderById(id);
  if (!co) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(co);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { title, description, finalTotal, status } = body;
    const updates: Parameters<typeof updateChangeOrder>[1] = {};
    if (typeof title === "string") updates.title = title;
    if (typeof description === "string") updates.description = description;
    if (typeof finalTotal === "number") updates.finalTotal = finalTotal;
    const validStatuses: ApprovalStatus[] = [
      "Draft", "In Review", "Priced", "Needs Revision",
      "Pending Approval", "Approved", "Rejected", "Synced",
    ];
    if (validStatuses.includes(status)) updates.status = status;
    const co = updateChangeOrder(id, updates);
    if (!co) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(co);
  } catch (e) {
    return NextResponse.json(
      { error: "Failed to update change order" },
      { status: 500 }
    );
  }
}
