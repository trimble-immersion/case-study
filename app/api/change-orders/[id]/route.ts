import { NextRequest, NextResponse } from "next/server";
import { ChangeOrderService } from "@/lib/services/changeOrderService";
import type { ApprovalStatus, ChangeOrderUpdateDto } from "@/lib/domain/types";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const co = ChangeOrderService.getChangeOrderById(id);
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
    const { title, description, finalTotal, status, modifiedBy } = body;
    const dto: ChangeOrderUpdateDto = {};
    if (typeof title === "string") dto.title = title;
    if (typeof description === "string") dto.description = description;
    if (typeof finalTotal === "number") dto.finalTotal = finalTotal;
    if (typeof modifiedBy === "string") dto.modifiedBy = modifiedBy;
    const validStatuses: ApprovalStatus[] = [
      "Draft", "In Review", "Priced", "Needs Revision",
      "Pending Approval", "Approved", "Rejected", "Synced",
    ];
    if (validStatuses.includes(status)) dto.status = status;
    const co = ChangeOrderService.updateChangeOrder(id, dto);
    if (!co) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(co);
  } catch (e) {
    return NextResponse.json(
      { error: "Failed to update change order" },
      { status: 500 }
    );
  }
}
