import { NextRequest, NextResponse } from "next/server";
import { getChangeOrderById } from "@/lib/services/changeOrderService";
import { approve } from "@/lib/services/approvalWorkflowService";
import { recordActivity } from "@/lib/services/auditService";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const co = getChangeOrderById(id);
  if (!co) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const body = await req.json();
  const { approvedBy, comment, finalTotal } = body;
  if (!approvedBy || typeof finalTotal !== "number") {
    return NextResponse.json(
      { error: "approvedBy and finalTotal required" },
      { status: 400 }
    );
  }
  const ok = approve({ changeOrderId: id, approvedBy, comment, finalTotal });
  if (!ok) return NextResponse.json({ error: "Approve failed" }, { status: 500 });
  recordActivity(id, "Approved", "Change order approved", undefined, approvedBy);
  const updated = getChangeOrderById(id);
  return NextResponse.json(updated);
}
