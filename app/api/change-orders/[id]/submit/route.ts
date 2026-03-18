import { NextResponse } from "next/server";
import { getChangeOrderById } from "@/lib/services/changeOrderService";
import { submitForApproval } from "@/lib/services/approvalWorkflowService";
import { recordActivity } from "@/lib/services/auditService";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const co = getChangeOrderById(id);
  if (!co) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (co.status !== "Draft" && co.status !== "Priced" && co.status !== "In Review") {
    return NextResponse.json(
      { error: "Change order not in a submittable state" },
      { status: 400 }
    );
  }
  const ok = submitForApproval(id);
  if (!ok) return NextResponse.json({ error: "Submit failed" }, { status: 500 });
  recordActivity(id, "Submitted", "Submitted for approval", undefined, co.requester);
  const updated = getChangeOrderById(id);
  return NextResponse.json(updated);
}
