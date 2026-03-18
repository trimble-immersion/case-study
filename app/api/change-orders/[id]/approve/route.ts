import { NextRequest, NextResponse } from "next/server";
import { ChangeOrderService } from "@/lib/services/changeOrderService";
import { ApprovalWorkflowService } from "@/lib/services/approvalWorkflowService";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const co = ChangeOrderService.getChangeOrderById(id);
  if (!co) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json();
  const { approvedBy, comment, finalTotal } = body;
  if (!approvedBy || typeof finalTotal !== "number") {
    return NextResponse.json(
      { error: "approvedBy and finalTotal required" },
      { status: 400 }
    );
  }

  const ok = ApprovalWorkflowService.approve({
    changeOrderId: id,
    approvedBy,
    comment,
    finalTotal,
  });
  if (!ok) return NextResponse.json({ error: "Approve failed" }, { status: 500 });

  const updated = ChangeOrderService.getChangeOrderById(id);
  return NextResponse.json(updated);
}
